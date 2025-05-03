<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Playlist;
use Inertia\Inertia;
use App\Models\Video;
use App\Models\User;
use App\Models\Comment;
class PlaylistController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
    ]);

    $playlist = Playlist::create([
        'user_id' => auth()->id(),
        'title'   => $request->title,
    ]);

    return response()->json($playlist); // ✅ حتماً JSON
}


public function show(Playlist $playlist)
{
    $playlist->load(['videos.user']);
    return Inertia::render('Videos/PlaylistsShow', [
        'playlist' => $playlist,
    ]);
}

public function addVideo(Request $request, Playlist $playlist)
{
    $request->validate(['video_id' => 'required|exists:videos,id']);

    if ($playlist->user_id !== auth()->id()) {
        abort(403);
    }

    $playlist->videos()->syncWithoutDetaching([$request->video_id]);

    return back()->with('message', 'Video added to playlist.');
}
public function myPlaylists()
{
    $playlists = auth()->user()->playlists()->get(['id', 'title']);
    return Inertia::render('Videos/MyPlaylists', ['playlists' => $playlists]);
}

public function update(Request $request, Playlist $playlist)
{
    if ($playlist->user_id !== auth()->id()) abort(403);
    $request->validate(['title' => 'required|string|max:255']);
    $playlist->update(['title' => $request->title]);
    return response()->noContent();
}

public function destroy(Playlist $playlist)
{
    if ($playlist->user_id !== auth()->id()) abort(403);
    $playlist->delete();
    return response()->noContent();
}

}
