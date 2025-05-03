<?php

use App\Models\Notification;

if (!function_exists('notify')) {
    function notify($userId, $type, $message)
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'read' => false
        ]);
    }
}
