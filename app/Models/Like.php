<?php

// app/Models/Like.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Like extends Model {
    use HasFactory;
    protected $fillable = ['video_id', 'user_id', 'like'];

    public function video() {
        return $this->belongsTo(Video::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}

