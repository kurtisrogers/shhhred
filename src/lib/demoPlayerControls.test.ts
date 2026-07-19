import { describe, expect, it } from 'vitest'
import {
  NAM_PLAYER_SHELL_SELECTOR,
  toggleMainPlayerPlayback,
} from './demoPlayerControls'

describe('toggleMainPlayerPlayback', () => {
  it('clicks the main player play or pause button', () => {
    document.body.innerHTML = `
      <div data-testid="nam-player">
        <button aria-label="Play">Play</button>
      </div>
    `

    const button = document.querySelector<HTMLButtonElement>(
      `${NAM_PLAYER_SHELL_SELECTOR} button[aria-label="Play"]`,
    )
    let clicked = false
    button?.addEventListener('click', () => {
      clicked = true
    })

    toggleMainPlayerPlayback()

    expect(clicked).toBe(true)
  })
})
