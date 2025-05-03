<?php
// app/Http/Controllers/CommentController.php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class CommentController extends Controller
{
    public function store(Request $request, Video $video)
    {
        $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);
        notify($video->user_id, 'comment', 'Someone commented on your video.', "/watch/{$video->slug}");

                Comment::create([
            'user_id'   => Auth::id(),
            'video_id'  => $video->id,
            'body'      => $request->body,
            'parent_id' => $request->parent_id,
        ]);

        return back();
    }
}
