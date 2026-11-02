/**
 * Utility to ensure image URLs resolve reliably across both Vite dev and production SSR/Hostinger
 */
export function getSafeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '/images/hero_ngo_education_1792839133429.jpg';
  }

  const clean = url.trim();

  // If starts with /src/assets/images/, convert to production-friendly /images/
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/images/');
  }

  if (clean.startsWith('src/assets/images/')) {
    return clean.replace('src/assets/images/', '/images/');
  }

  return clean;
}
