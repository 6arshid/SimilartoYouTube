<?php

// database/migrations/2025_05_03_000000_create_videos_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // کاربر آپلودکننده ویدیو
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('path');      // مسیر ذخیره فایل ویدیو
            $table->unsignedBigInteger('views')->default(0);  // تعداد بازدید
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('videos');
    }
};
