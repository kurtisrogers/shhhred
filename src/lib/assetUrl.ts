export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalizedPath = path.replace(/^\//, '')
  return `${base}${normalizedPath}`
}
