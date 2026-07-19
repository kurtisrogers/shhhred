export const NAM_PLAYER_SHELL_SELECTOR = '[data-testid="nam-player"]'

export function toggleMainPlayerPlayback(): void {
  const shell = document.querySelector(NAM_PLAYER_SHELL_SELECTOR)
  if (!shell) {
    return
  }

  const button = shell.querySelector<HTMLButtonElement>(
    'button[aria-label="Play"], button[aria-label="Pause"]',
  )

  button?.click()
}
