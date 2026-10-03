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
      return 'bg-zinc-100 text-zinc-800 border-zinc-200/80';
    case 'Lifestyle':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    case 'Business':
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    case 'Design':
      return 'bg-purple-50 text-purple-800 border-purple-200/80';
    default:
      return 'bg-zinc-100 text-zinc-800 border-zinc-200/80';
  }
}
