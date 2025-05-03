// resources/js/Pages/Profile/utils/cropImage.js
import { createImage } from './helpers';

export default async function getCroppedImg(imageSrc, pixelCrop, type = 'avatar') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
}
