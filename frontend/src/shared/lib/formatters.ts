/**
 * Format a date string into a user-friendly format (e.g. "Oct 2, 2026")
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format view counts with K suffix if >= 1000 (e.g. "1.2K")
 */
export function formatViews(views?: number): string {
  const count = views || 0;
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

/**
 * Return consistent Tailwind badge colors based on post category
 */
export function getCategoryBadgeClass(category?: string): string {
  switch (category) {
    case 'Technology':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Lifestyle':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Business':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Design':
      return 'bg-purple-50 text-purple-600 border-purple-100';
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100';
  }
}
