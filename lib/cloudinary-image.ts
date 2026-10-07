// Helpers for showing Cloudinary-hosted photos with next/image. Client-safe:
// nothing here reads secrets.

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";

export const isCloudinaryUrl = (src: string) => src.startsWith(CLOUDINARY_PREFIX);

/**
 * next/image loader for Cloudinary delivery URLs. Cloudinary resizes the photo
 * to the width the page asked for and picks the best format and quality, so the
 * browser never downloads the full-size original.
 */
export function cloudinaryLoader({ src, width }: { src: string; width: number }) {
  return src.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

/**
 * Props for <Image> so it works with either a Cloudinary URL (resized by
 * Cloudinary) or a local /public path (optimised by Next). Other remote URLs,
 * such as GIPHY, are shown as they are.
 */
export function imageProps(src: string) {
  if (isCloudinaryUrl(src)) return { loader: cloudinaryLoader };
  return { unoptimized: /^https?:\/\//.test(src) };
}

/** A 1200px-wide JPEG for link previews (WhatsApp, X). Local paths are returned unchanged. */
export const shareImageUrl = (src: string) =>
  isCloudinaryUrl(src) ? src.replace("/image/upload/", "/image/upload/f_jpg,q_auto,c_limit,w_1200/") : src;
