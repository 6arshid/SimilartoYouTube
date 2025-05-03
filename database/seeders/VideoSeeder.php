<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Video;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        foreach (range(1, 5) as $i) {
            Video::create([
                'user_id'    => 1, // فرض بر اینه کاربر ID=1 وجود داره
                'title'      => "Test Video {$i}",
                'slug'       => "test-video-{$i}",
                'description'=> 'Sample video for welcome page.',
                'path'       => "videos/sample{$i}.mp4",
                'thumbnail'  => "images/default-thumbnail.jpg",
                'views'      => rand(100, 1000),
            ]);
        }
    }
}
