<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('user_followers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('follower_id')->constrained('users')->onDelete('cascade'); // کسی که دنبال می‌کند
        $table->foreignId('followed_id')->constrained('users')->onDelete('cascade'); // کسی که دنبال می‌شود
        $table->timestamps();

        $table->unique(['follower_id', 'followed_id']); // هر جفت فقط یک‌بار
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_followers');
    }
};
