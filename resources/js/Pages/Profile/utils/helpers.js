// resources/js/Pages/Profile/utils/helpers.js

export function createImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // رفع محدودیت امنیتی مرورگرها
      image.src = url;
    });
  }
  