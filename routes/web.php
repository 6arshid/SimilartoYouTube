<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentLikeController;
use App\Http\Controllers\PlaylistController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Video;
use App\Models\Notification;
Route::get('/', function () {
    $topVideos = Video::with('user')
        ->orderByDesc('views')
        ->take(60)
        ->get(['id', 'title', 'slug', 'thumbnail', 'user_id', 'views']);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'topVideos' => $topVideos,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
     Route::get('/videos', [VideoController::class, 'index'])->name('videos.index');
     Route::get('/videos/create', [VideoController::class, 'create'])->name('videos.create');
     Route::post('/videos', [VideoController::class, 'store'])->name('videos.store');
     Route::get('/videos/{video}', [VideoController::class, 'show'])->name('videos.show');
     Route::get('/videos/{video}/edit', [VideoController::class, 'edit'])->name('videos.edit');
     Route::put('/videos/{video}', [VideoController::class, 'update'])->name('videos.update');
     Route::delete('/videos/{video}', [VideoController::class, 'destroy'])->name('videos.destroy');
     Route::post('videos/{video}/like', [VideoController::class, 'like'])->name('videos.like');
     Route::post('videos/{video}/dislike', [VideoController::class, 'dislike'])->name('videos.dislike');
     Route::post('/subscribe/{user}', [ProfileController::class, 'subscribe'])->name('subscribe');
     Route::get('/feed', [VideoController::class, 'feed'])->name('videos.feed');
     Route::post('/videos/{video}/comments', [CommentController::class, 'store'])->name('comments.store');
     Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggle'])->name('comments.like');
     Route::post('/videos/{video}/like', [VideoController::class, 'toggle']);
     Route::post('/profile/update-avatar', [ProfileController::class, 'updateAvatar'])
     ->name('profile.update.avatar');
    Route::post('/profile/update-cover', [ProfileController::class, 'updateCover'])
     ->name('profile.update.cover');
    Route::delete('/profile/delete-avatar', [ProfileController::class, 'deleteAvatar'])
     ->name('profile.delete.avatar');
    Route::delete('/profile/delete-cover', [ProfileController::class, 'deleteCover'])
     ->name('profile.delete.cover');
    Route::get('/notifications', function () {
        return auth()->user()->notifications()->latest()->get();
    });
    
    Route::post('/notifications/mark-read', function () {
        Auth::user()->notifications()->update(['read' => true]);
        return response()->noContent();
    });
    Route::post('/playlists', [PlaylistController::class, 'store'])->name('playlists.store');
    Route::get('/playlists/{playlist}', [PlaylistController::class, 'show'])->name('playlists.show');
    Route::post('/playlists/{playlist}/add-video', [PlaylistController::class, 'addVideo'])->name('playlists.addVideo');
    Route::get('/my-playlists', [PlaylistController::class, 'myPlaylists'])->name('playlists.my');
    Route::put('/playlists/{playlist}', [PlaylistController::class, 'update']);
    Route::delete('/playlists/{playlist}', [PlaylistController::class, 'destroy']);

});
// Route::get('/watch/{video}', [VideoController::class, 'show'])->name('videos.watch');
Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
Route::get('/watch/{slug}', [VideoController::class, 'watch'])->name('videos.watch');
Route::get('/explorer', [VideoController::class, 'explorer'])->name('videos.explorer');
require __DIR__.'/auth.php';
