/**
 * Image Optimization Helper
 * Scales down raw image URLs (e.g. Unsplash) to exactly the requested width
 * and converts them to modern formats to preserve bandwidth.
 */
export function getOptimizedImageUrl(url: string, width: number = 600, quality: number = 75): string {
  if (!url) return '';

  // 1. Unsplash URL Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      parsedUrl.searchParams.set('auto', 'format'); // Automatically picks WebP/AVIF
      parsedUrl.searchParams.set('fit', 'crop');
      return parsedUrl.toString();
    } catch (e) {
      return url;
    }
  }

  // 2. Add other image provider support here if needed (e.g., Cloudinary, Cloudflare Images)

  return url;
}
