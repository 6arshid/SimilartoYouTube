// resources/js/Pages/Videos/Index.jsx
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';   // جهت مسیریابی برنامه Inertia
import axios from 'axios';

export default function Index(props) {
  const { videos, users, filters } = props;
  // State برای فیلترها و نتایج
  const [search, setSearch] = useState(filters.search || '');
  const [user, setUser] = useState(filters.user || '');
  const [date, setDate] = useState(filters.date || '');
  const [videoList, setVideoList] = useState(videos.data);
  const [currentPage, setCurrentPage] = useState(videos.current_page);
  const [lastPage, setLastPage] = useState(videos.last_page);
  const [loadingMore, setLoadingMore] = useState(false);

  // اگر props.videos تغییر کرد (مثلاً بعد از جستجو)، videoList را بازنشانی کن
  useEffect(() => {
    setVideoList(videos.data);
    setCurrentPage(videos.current_page);
    setLastPage(videos.last_page);
  }, [videos]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // ارسال پارامترهای فیلتر به سرور با Inertia
    router.get('/videos', { 
      search: search || undefined,
      user: user || undefined,
      date: date || undefined 
    });
    // نیازی به setVideoList نیست، useEffect بالا پس از دریافت نتایج جدید فراخوانی می‌شود
  };

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      setLoadingMore(true);
      // درخواست صفحه بعدی نتایج به صورت JSON
      axios.get(`/videos?page=${currentPage + 1}&search=${search}&user=${user}&date=${date}`)
        .then(response => {
          const newData = response.data.data;
          setVideoList(prevList => [...prevList, ...newData]);  // الحاق موارد جدید
          setCurrentPage(response.data.current_page);
          setLastPage(response.data.last_page);
        })
        .finally(() => setLoadingMore(false));
    }
  };

  return (
    <div className="p-6">
      {/* فرم جستجو و فیلتر */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-col md:flex-row md:items-end md:space-x-4">
        <div className="flex-1 mb-2 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">جستجو بر اساس عنوان:</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                 className="w-full rounded border-gray-300" placeholder="عنوان ویدیو را وارد کنید..." />
        </div>
        <div className="mb-2 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">فیلتر کاربر:</label>
          <select value={user} onChange={e => setUser(e.target.value)} className="rounded border-gray-300">
            <option value="">-- همه کاربران --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">فیلتر تاریخ:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded border-gray-300" />
        </div>
        <button type="submit" className="md:mx-2 mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded">
          جستجو
        </button>
      </form>

      {/* لیست ویدیوها */}
      <div className="space-y-4">
        {videoList.map(video => (
          <div key={video.id} className="p-4 border rounded flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                توسط: {users.find(u => u.id === video.user_id)?.name || 'ناشناس'} – تاریخ: {new Date(video.created_at).toLocaleDateString('fa-IR')}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:text-center">
              <span className="text-green-600 font-semibold mx-2">👍 {video.likes_count}</span>
              <span className="text-red-600 font-semibold mx-2">👎 {video.dislikes_count}</span>
              <span className="text-gray-600 mx-2">👁️ {video.views}</span>
              <a href={`/videos/${video.id}`} className="text-blue-500 hover:underline mx-2">مشاهده</a>
              {/* لینک‌های ویرایش/حذف فقط برای صاحب ویدیو نمایش داده شود */}
              {video.user_id === props.auth.user.id && (
                <>
                  <a href={`/videos/${video.id}/edit`} className="text-yellow-500 hover:underline mx-2">ویرایش</a>
                  {/* برای حذف می‌توانیم از Inertia<form> استفاده کنیم، اینجا ساده لینک دادیم */}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* دکمه "بارگذاری بیشتر" */}
      {currentPage < lastPage && (
        <div className="text-center mt-4">
          <button onClick={loadMore} disabled={loadingMore}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            {loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر'}
          </button>
        </div>
      )}
    </div>
  );
}
