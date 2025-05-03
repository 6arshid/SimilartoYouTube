<?php

// app/Http/Controllers/VideoController.php
namespace App\Http\Controllers;
use App\Models\Video;
use App\Models\Like;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class VideoController extends Controller
{
    

    // نمایش لیست ویدیوها با قابلیت جستجو، فیلتر و صفحه‌بندی
    public function index(Request $request) {
        // فیلترهای جستجو
        $query = Video::query()->withCount(['likes', 'dislikes']);  // محاسبه تعداد لایک/دیسلایک
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }
        if ($userId = $request->input('user')) {
            $query->where('user_id', $userId);
        }
        if ($date = $request->input('date')) {
            // فیلتر بر اساس تاریخ ایجاد (همان روز)
            $query->whereDate('created_at', $date);
        }
        $query->orderBy('created_at', 'desc');
        $videos = $query->paginate(5)->withQueryString(); // صفحه‌بندی (۵ آیتم در هر صفحه)

        // اگر درخواست AJAX باشد (برای "Load More")، داده خام JSON برگردانیم
        if ($request->wantsJson()) {
            return response()->json($videos);
        }

        // در غیراینصورت، یک پاسخ Inertia با props لازم
        $users = User::orderBy('name')->get(['id','name']);  // لیست کاربران جهت فیلتر
        return Inertia::render('Videos/Index', [
            'videos'  => $videos,
            'users'   => $users,
            'filters' => [
                'search' => $search,
                'user'   => $userId,
                'date'   => $date,
            ],
        ]);
    }

    // نمایش فرم ایجاد ویدیو جدید
    public function create() {
        // در اینجا صرفاً صفحه خالی فرم باز می‌شود (اطلاعاتی از سرور نیاز نیست)
        return Inertia::render('Videos/Create');
    }

    // ذخیره ویدیو جدید در دیتابیس
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'video'       => 'required|file|mimes:mp4,webm,avi|max:51200',
            'thumbnail'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        // 1. ذخیره ویدیو
        $videoFile = $request->file('video');
        $path = $videoFile->store('videos', 'public');
    
        // 2. تولید slug یکتا
        $slug = Str::random(12);
    
        // 3. ذخیره یا ساخت thumbnail
        $thumbnailPath = null;
    
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            $thumbnailName = Str::random(12) . '.jpg';
            $videoFullPath = storage_path("app/public/{$path}");
            $generatedPath = storage_path("app/public/thumbnails/{$thumbnailName}");
    
            // تولید thumbnail با FFmpeg از ثانیه 1
            exec("ffmpeg -i \"{$videoFullPath}\" -ss 00:00:01 -vframes 1 \"{$generatedPath}\"");
    
            if (file_exists($generatedPath)) {
                $thumbnailPath = "thumbnails/{$thumbnailName}";
            }
        }
    
        // 4. ذخیره در دیتابیس
        $video = Video::create([
            'user_id'     => auth()->id(),
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? '',
            'path'        => $path,
            'thumbnail'   => $thumbnailPath,
            'slug'        => $slug,
            'views'       => 0,
        ]);
    
        return redirect()->to("/watch/{$video->slug}");
    }
    

    // نمایش جزئیات یک ویدیو (و افزایش شمار بازدید)
    public function show(Video $video) {
        // افزایش شمارنده بازدید
        $video->increment('views');
        // بارگذاری شمار لایک‌ها و وضعیت لایک کاربر جاری
        $video->loadCount(['likes', 'dislikes']);
        $userLike = null;
        if (Auth::check()) {
            // بررسی اینکه کاربر فعلی لایک یا دیسلایک کرده یا خیر
            $likeRecord = Like::where('video_id', $video->id)->where('user_id', Auth::id())->first();
            if ($likeRecord) {
                $userLike = $likeRecord->like ? 'like' : 'dislike';
            }
        }
        return Inertia::render('Videos/Show', [
            'video'    => $video,
            'userLike' => $userLike,
        ]);
    }

    // نمایش فرم ویرایش ویدیو
    public function edit(Video $video) {
        // فقط اجازه ویرایش به صاحب ویدیو
        if ($video->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Videos/Edit', [
            'video' => $video
        ]);
    }

    // بروزرسانی اطلاعات ویدیو
    public function update(Request $request, Video $video) {
        if ($video->user_id !== Auth::id()) {
            abort(403);
        }
        $validated = $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'video'       => 'sometimes|file|mimes:mp4,avi,webm|max:51200',
        ]);
        // بروزرسانی فیلدهای ساده
        $video->title = $validated['title'];
        $video->description = $validated['description'] ?? '';
        // در صورت ارسال فایل جدید، جایگزین شود
        if ($request->hasFile('video')) {
            // حذف فایل قدیمی در فضای ذخیره‌سازی
            Storage::delete($video->path);
            // آپلود فایل جدید
            $file = $request->file('video');
            $path = $file->store('videos', ['disk' => config('filesystems.default')]);
            $video->path = $path;
        }
        $video->save();
        return redirect()->route('videos.show', $video);
    }

    // حذف ویدیو
    public function destroy(Video $video) {
        if ($video->user_id !== Auth::id()) {
            abort(403);
        }
        // حذف رکوردهای مرتبط (لایک‌ها) به صورت خودکار به خاطر onDelete cascade
        // حذف فایل ویدیو از فضای ذخیره‌سازی
        Storage::delete($video->path);
        $video->delete();
        return redirect()->route('videos.index');
    }

    // ثبت لایک یک ویدیو
    public function like(Video $video) {
        $userId = Auth::id();
        $existing = Like::where('video_id', $video->id)->where('user_id', $userId)->first();
        if ($existing) {
            if ($existing->like) {
                // اگر قبلاً لایک کرده، دوباره لایک به معنی لغو لایک است
                $existing->delete();
            } else {
                // اگر قبلاً دیسلایک کرده، تبدیل به لایک
                $existing->like = true;
                $existing->save();
            }
        } else {
            // در صورت نبودن رکورد، ایجاد لایک جدید
            Like::create([
                'video_id' => $video->id,
                'user_id'  => $userId,
                'like'     => true
            ]);
        }
        return back();
    }

    // ثبت دیسلایک یک ویدیو
    public function dislike(Video $video) {
        $userId = Auth::id();
        $existing = Like::where('video_id', $video->id)->where('user_id', $userId)->first();
        if ($existing) {
            if (!$existing->like) {
                // اگر قبلاً دیسلایک کرده و دوباره کلیک کرده، پس لغو دیسلایک
                $existing->delete();
            } else {
                // اگر قبلاً لایک کرده بود، تبدیل به دیسلایک
                $existing->like = false;
                $existing->save();
            }
        } else {
            // ایجاد رکورد دیسلایک جدید
            Like::create([
                'video_id' => $video->id,
                'user_id'  => $userId,
                'like'     => false
            ]);
        }
        return back();
    }
    public function watch($slug)
    {
        $video = Video::where('slug', $slug)
            ->withCount(['likes', 'dislikes'])
            ->with('user')
            ->firstOrFail();
    
        $video->increment('views');
    
        $userLike = null;
        if (Auth::check()) {
            $like = $video->likesRelation()
                ->where('user_id', Auth::id())
                ->first();
            if ($like) {
                $userLike = $like->like ? 'like' : 'dislike';
            }
        }
    
        $isFollowing = false;
        if (Auth::check() && $video->user_id !== Auth::id()) {
            $isFollowing = Auth::user()
                ->following()
                ->where('followed_id', $video->user_id)
                ->exists();
        }
    
        // ✅ دریافت کامنت‌ها همراه با پاسخ‌ها و تعداد لایک‌ها
        $comments = $video->comments()
            ->whereNull('parent_id')
            ->with(['user', 'likes', 'dislikes', 'replies.user', 'replies.likes', 'replies.dislikes'])
            ->latest()
            ->get();
    
        // ✅ دریافت ویدیوهای دیگر همان کاربر
        $relatedFromUser = Video::where('user_id', $video->user_id)
        ->where('id', '!=', $video->id)
        ->select('id', 'title', 'slug', 'thumbnail', 'user_id')
        ->with('user')
        ->latest()
        ->take(10)
        ->get();
    
    $remaining = 10 - $relatedFromUser->count();
    
    $relatedFromOthers = collect();
    
    if ($remaining > 0) {
        $relatedFromOthers = Video::where('user_id', '!=', $video->user_id)
            ->where('id', '!=', $video->id)
            ->select('id', 'title', 'slug', 'thumbnail', 'user_id')
            ->with('user')
            ->latest()
            ->take($remaining)
            ->get();
    }
    
    $relatedVideos = $relatedFromUser->merge($relatedFromOthers);
    
        return Inertia::render('Videos/Show', [
            'video'         => $video,
            'userLike'      => $userLike,
            'isFollowing'   => $isFollowing,
            'comments'      => $comments,
            'relatedVideos' => $relatedVideos,
            'auth'          => Auth::check() ? ['user' => Auth::user()] : null,
        ]);
    }
    
public function feed()
{
    $user = auth()->user();
    $videos = Video::whereIn('user_id', $user->following->pluck('id'))
                   ->latest()
                   ->with('user')
                   ->paginate(10);

    return Inertia::render('Videos/Feed', ['videos' => $videos]);
}
public function toggle(Request $request, Video $video)
{
    $request->validate([
        'like' => 'required|boolean',
    ]);

    $user = Auth::user();

    $existing = $video->likesRelation()->where('user_id', $user->id)->first();

    if ($existing) {
        if ($existing->like == $request->like) {
            $existing->delete();
        } else {
            $existing->update(['like' => $request->like]);
        }
    } else {
        $video->likesRelation()->create([
            'user_id' => $user->id,
            'like'    => $request->like,
        ]);
    }

    return response()->json([
        'likes_count'    => $video->likes()->count(),
        'dislikes_count' => $video->dislikes()->count(),
        'userLike'       => $video->likesRelation()->where('user_id', $user->id)->value('like') ? 'like' : 'dislike',
    ]);
}

}
