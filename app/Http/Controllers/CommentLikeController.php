<?php
// app/Http/Controllers/CommentLikeController.php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentLikeController extends Controller
{
    public function toggle(Request $request, Comment $comment)
    {
        $request->validate([
            'like' => 'required|boolean',
        ]);

        $user = Auth::user();

        $existing = CommentLike::where('comment_id', $comment->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            if ($existing->like == $request->like) {
                $existing->delete(); // remove existing like/dislike
            } else {
                $existing->update(['like' => $request->like]);
            }
        } else {
            CommentLike::create([
                'comment_id' => $comment->id,
                'user_id'    => $user->id,
                'like'       => $request->like,
            ]);
        }

        return back();
    }
}
