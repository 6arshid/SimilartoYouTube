<?php

// database/migrations/2025_05_03_000001_create_likes_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->onDelete('cascade'); // آیدی ویدیو
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // آیدی کاربر
            $table->boolean('like');    // true = لایک، false = دیسلایک :contentReference[oaicite:1]{index=1}
            $table->timestamps();
            $table->unique(['video_id','user_id']); // هر کاربر-ویدیو یکبار
        });
    }
    public function down(): void {
        Schema::dropIfExists('likes');
    }
};
