<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
    public function subscribe(User $user)
    {
        $me = auth()->user();
    
        if ($me->id === $user->id) {
            return back()->with('error', 'نمی‌توانید خودتان را دنبال کنید.');
        }
    
        $alreadyFollowing = $me->following()->where('followed_id', $user->id)->exists();
    
        if ($alreadyFollowing) {
            $me->following()->detach($user->id); // لغو عضویت
        } else {
            $me->following()->attach($user->id); // عضویت جدید
        }
    
        return back();
    }
    public function show(User $user)
    {
        $videos = $user->videos()
            ->select('id', 'title', 'slug', 'views', 'thumbnail', 'created_at')
            ->latest()
            ->get();

        return Inertia::render('Profile/Show', [
            'user'   => $user,
            'videos' => $videos,
        ]);
    }
}
