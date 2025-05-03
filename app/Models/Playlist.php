<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    protected $fillable = ['user_id', 'title'];

    public function videos()
{
    return $this->belongsToMany(Video::class);
}

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
