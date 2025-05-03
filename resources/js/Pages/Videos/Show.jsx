// resources/js/Pages/Videos/Show.jsx
import { router, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Show() {
  const { video, userLike, isFollowing, auth, comments = [], relatedVideos = [] } = usePage().props;

  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [likeCount, setLikeCount] = useState(video.likes_count);
  const [dislikeCount, setDislikeCount] = useState(video.dislikes_count);
  const [userLikeState, setUserLikeState] = useState(userLike);

  const videoUrl = video.path.startsWith('http')
    ? video.path
    : `/storage/${video.path}`;

  const handleVideoLike = (isLike) => {
    if (!auth?.user) return alert('برای رأی دادن وارد شوید');

    axios.post(`/videos/${video.id}/like`, { like: isLike }).then(res => {
      setLikeCount(res.data.likes_count);
      setDislikeCount(res.data.dislikes_count);
      setUserLikeState(res.data.userLike);
    });
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!auth?.user) return alert('برای ارسال نظر باید وارد شوید.');
    if (comment.trim() === '') return;

    router.post(`/videos/${video.id}/comments`, {
      body: comment,
      parent_id: replyTo
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment('');
        setReplyTo(null);
      }
    });
  };

  const handleCommentLike = (commentId, isLike) => {
    if (!auth?.user) return alert('برای رأی دادن باید وارد شوید.');
    router.post(`/comments/${commentId}/like`, {
      like: isLike,
    }, {
      preserveScroll: true,
    });
  };

  const followStatus = typeof isFollowing !== 'undefined' ? isFollowing : false;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Head title={video.title} />
        <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
        {video.user && (
          <p className="text-sm text-gray-500 mb-4">
            توسط{' '}
            <a href={`/profile/${video.user.id}`} className="text-blue-600 hover:underline">
              {video.user.name}
            </a>{' '}
            در تاریخ {new Date(video.created_at).toLocaleDateString('fa-IR')} – 
            <span className="mx-1">👁️ {video.views} بازدید</span>
          </p>
        )}

        <div className="mb-6">
          <video controls className="w-full max-w-xl mx-auto" preload="metadata">
            <source src={videoUrl} type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>
        </div>

        <div className="mb-4 flex gap-4">
          <button
            onClick={() => handleVideoLike(true)}
            className={`px-4 py-2 rounded ${userLikeState === 'like' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            👍 لایک ({likeCount})
          </button>
          <button
            onClick={() => handleVideoLike(false)}
            className={`px-4 py-2 rounded ${userLikeState === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            👎 دیسلایک ({dislikeCount})
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          {auth?.user && video.user_id !== auth.user.id && (
            <button
              onClick={() => router.post(`/subscribe/${video.user.id}`)}
              className={`px-4 py-2 rounded ${followStatus ? 'bg-red-600' : 'bg-purple-600'} text-white`}
            >
              {followStatus ? 'لغو عضویت (Unfollow)' : `عضویت در ${video.user?.name || 'کاربر'}`}
            </button>
          )}
          <button onClick={handleShare} className="px-4 py-2 bg-yellow-500 text-white rounded">اشتراک‌گذاری</button>
          <button onClick={handleDownload} className="px-4 py-2 bg-gray-700 text-white rounded">دانلود ویدیو</button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">نظرات</h2>

          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder={replyTo ? 'پاسخ خود را بنویسید...' : 'نظر خود را بنویسید...'}
              rows="3"
            />
            {replyTo && (
              <p className="text-sm text-gray-500 mb-2">در حال پاسخ به کامنت #{replyTo}</p>
            )}
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              ارسال نظر
            </button>
          </form>

          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="border p-3 rounded">
                <p className="text-sm font-semibold">{c.user?.name || 'کاربر'}:</p>
                <p className="text-gray-700 mb-2">{c.body}</p>
                <div className="flex gap-4 text-sm">
                  <button onClick={() => handleCommentLike(c.id, true)} className="text-green-600">👍 {c.likes?.length || 0}</button>
                  <button onClick={() => handleCommentLike(c.id, false)} className="text-red-600">👎 {c.dislikes?.length || 0}</button>
                  {auth?.user && (
                    <button onClick={() => setReplyTo(c.id)} className="text-blue-500 hover:underline">پاسخ</button>
                  )}
                </div>
                {c.replies && c.replies.length > 0 && (
                  <div className="mt-3 space-y-2 border-r pr-3">
                    {c.replies.map(reply => (
                      <div key={reply.id} className="border p-2 rounded bg-gray-50">
                        <p className="text-sm font-semibold">{reply.user?.name || 'کاربر'}:</p>
                        <p className="text-gray-700 mb-1">{reply.body}</p>
                        <div className="flex gap-3 text-xs">
                          <button onClick={() => handleCommentLike(reply.id, true)} className="text-green-600">👍 {reply.likes?.length || 0}</button>
                          <button onClick={() => handleCommentLike(reply.id, false)} className="text-red-600">👎 {reply.dislikes?.length || 0}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-2">ویدیوهای دیگر</h3>
        {relatedVideos.map(v => (
          <div key={v.id} className="border rounded p-2">
            <a href={`/watch/${v.slug}`} className="block">
              <img
                src={v.thumbnail ? `/storage/${v.thumbnail}` : '/images/default-thumbnail.jpg'}
                onError={(e) => { e.target.src = '/images/default-thumbnail.jpg'; }}
                alt={v.title}
                className="w-full h-28 object-cover rounded mb-2"
              />
              <span className="text-sm font-semibold text-blue-600 hover:underline block">
                {v.title}
              </span>
            </a>
            <p className="text-xs text-gray-500">توسط: {v.user?.name || 'کاربر'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}