export const NAM_PLAYER_ID = 'shhhred-main-player'

export function audioSourcesMatch(
  loadedUrl: string | null,
  nextUrl: string,
): boolean {
  if (!loadedUrl) {
    return false
  }

  if (loadedUrl === nextUrl) {
    return true
  }

  try {
    const loadedPath = new URL(loadedUrl, window.location.origin).pathname
    const nextPath = new URL(nextUrl, window.location.origin).pathname
    return loadedPath === nextPath
  } catch {
    return loadedUrl.endsWith(nextUrl) || nextUrl.endsWith(loadedUrl)
  }
}

export function createPlayerMountKey(
  initState: string,
  selectedDemoInputName: string,
  selectedModelName: string,
): string {
  if (initState === 'ready') {
    return `${NAM_PLAYER_ID}::${selectedDemoInputName}`
  }

  return `${selectedDemoInputName}::${selectedModelName}`
}
