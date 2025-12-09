// Utility for normalizing external image URLs to HTTPS and providing fallbacks
export function ensureHttps(url) {
  if (!url || typeof url !== 'string') return null;
  // protocol-relative //example.com/path -> https://example.com/path
  if (url.startsWith('//')) return 'https:' + url;
  // http:// -> https://
  if (url.startsWith('http://')) return 'https://' + url.slice(7);
  return url;
}

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x500?text=No+Image';
