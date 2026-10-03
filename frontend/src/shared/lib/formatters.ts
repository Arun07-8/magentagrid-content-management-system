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

