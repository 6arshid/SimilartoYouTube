# Similar to YouTube - Installation Guide

## Features

- **User Authentication**: Register, login, logout, and password reset functionality.
- **Video Uploading**: Users can upload videos with titles, descriptions, and thumbnails.
- **Video Playback**: Fully functional video player with support for full screen, volume, and seeking.
- **Likes & Dislikes**: Users can like or dislike videos.
- **Subscriptions**: Subscribe/unsubscribe to other users’ channels.
- **Comments**: Comment on videos with support for nested replies.
- **Video Search**: Search functionality to find videos by title or description.
- **User Channels**: Each user has a personal channel page listing all their uploads.
- **Playlists**: Users can create and manage custom playlists, add/remove videos, and play them in order.
- **Notifications**: Real-time notifications for new subscriptions, comments, likes, and uploads.
- **Responsive UI**: Mobile-first design, works across various screen sizes.

## Requirements

- PHP 8.1+
- Composer
- Node.js & NPM
- Git
- MySQL (or any compatible database)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/6arshid/SimilartoYouTube.git
cd SimilartoYouTube
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Set Up Environment File

```bash
cp .env.example .env
```

Update your `.env` file with appropriate database and mail configurations.

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Seed the Database (Optional)

```bash
php artisan db:seed
```

### 8. Serve the Application

```bash
php artisan serve
```

Application should be accessible at:

```
http://localhost:8000
```

### 9. Compile Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

---

## Additional Notes

- Ensure the `storage/` and `bootstrap/cache/` directories are writable.
- Make sure your database is running and accessible.
- Depending on the frontend framework used, Inertia.js or Vue.js might require additional setup (check the codebase).
- To use notifications, configure a broadcast driver like Pusher or Laravel Echo in `.env`.

---

Happy coding! 🎬
