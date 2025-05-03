<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentLikeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
     // CRUD resource routes for videos
     Route::resource('videos', VideoController::class);

     // Extra routes for like/dislike actions
     Route::post('videos/{video}/like', [VideoController::class, 'like'])->name('videos.like');
     Route::post('videos/{video}/dislike', [VideoController::class, 'dislike'])->name('videos.dislike');
     Route::post('/subscribe/{user}', [ProfileController::class, 'subscribe'])->name('subscribe');
     Route::get('/feed', [VideoController::class, 'feed'])->name('videos.feed');
     Route::post('/videos/{video}/comments', [CommentController::class, 'store'])->name('comments.store');
     Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggle'])->name('comments.like');
     Route::post('/videos/{video}/like', [VideoController::class, 'toggle']);


});
// Route::get('/watch/{video}', [VideoController::class, 'show'])->name('videos.watch');
Route::get('/watch/{slug}', [VideoController::class, 'watch'])->name('videos.watch');

require __DIR__.'/auth.php';
