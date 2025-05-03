<?php

// app/Models/Video.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'title', 'description', 'path', 'views'];

    // ویدیو متعلق به یک کاربر است
    public function user() {
        return $this->belongsTo(User::class);
    }

    // تمامی رای‌های (لایک/دیسلایک) این ویدیو
    public function likesRelation() {
        return $this->hasMany(Like::class);
    }

    // فقط رای‌های لایک‌شده
    public function likes() {
        return $this->hasMany(Like::class)->where('like', true);  // :contentReference[oaicite:5]{index=5}
    }

    // فقط رای‌های دیسلایک‌شده
    public function dislikes() {
        return $this->hasMany(Like::class)->where('like', false); // :contentReference[oaicite:6]{index=6}
    }
}
