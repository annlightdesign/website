// Utility to convert a name into a URL-friendly slug
export function generateSlug(name: string): string {
  if (!name) return '';
  return encodeURIComponent(name.replace(/\s+/g, '-'));
}

// Utility to convert a slug back to a searchable name string
export function decodeSlug(slug: string): string {
  if (!slug) return '';
  return decodeURIComponent(slug).replace(/-/g, ' ');
}
