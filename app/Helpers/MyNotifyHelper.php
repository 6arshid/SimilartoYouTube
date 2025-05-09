<?php

use App\Models\MyNotification;

if (!function_exists('notify')) {
    function notify($userId, $type, $message, $url = null)
{
    MyNotification::create([
        'user_id' => $userId,
        'type' => $type,
        'message' => $message,
        'url' => $url,
        'read' => false,
    ]);
}
}
