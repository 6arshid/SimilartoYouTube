// resources/js/Pages/Videos/Show.jsx
import { router, Head, usePage } from '@inertiajs/react';

export default function Show(props) {
  const { video, userLike } = usePage().props;

  const videoUrl = video.path.startsWith('http')
    ? video.path
    : `/storage/${video.path}`;

  const handleLike = () => {
    router.post(`/videos/${video.id}/like`);
  };

  const handleDislike = () => {
    router.post(`/videos/${video.id}/dislike`);
  };

  const handleDownload = () => {
    window.open(videoUrl, '_blank');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('لینک ویدیو کپی شد');
    });
  };

  return (
    <div className="p-6">
      <Head title={video.title} />
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <p className="mb-2 text-gray-700">{video.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        توسط {video.user?.name || 'نامشخص'} در تاریخ{' '}
        {new Date(video.created_at).toLocaleDateString('fa-IR')} –
        <span className="mx-1">👁️ {video.views} بازدید</span>
      </p>

      {/* Video Player */}
      <div className="mb-6">
        <video controls className="w-full max-w-xl mx-auto" preload="metadata">
          <source src={videoUrl} type="video/mp4" />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>

      {/* Like/Dislike */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${userLike === 'like' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          👍 لایک ({video.likes_count})
        </button>
        <button
          onClick={handleDislike}
          className={`px-4 py-2 rounded ${userLike === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          👎 دیسلایک ({video.dislikes_count})
        </button>
      </div>

      {/* Subscribe / Share / Download */}
      <div className="mb-6 flex gap-4">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">عضویت</button>
        <button onClick={handleShare} className="px-4 py-2 bg-yellow-500 text-white rounded">اشتراک‌گذاری</button>
        <button onClick={handleDownload} className="px-4 py-2 bg-gray-700 text-white rounded">دانلود ویدیو</button>
      </div>

      {/* Back link */}
      <a href="/videos" className="text-blue-500 hover:underline">
        ← بازگشت به لیست ویدیوها
      </a>
    </div>
  );
}