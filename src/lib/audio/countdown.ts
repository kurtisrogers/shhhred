import type { JamSessionPhase } from '../../types/jamSession'

export interface CountdownController {
  cancel: () => void
}

export function startCountdown(
  seconds: number,
  onTick: (remaining: number) => void,
  onComplete: () => void,
): CountdownController {
  let remaining = seconds
  let cancelled = false
  let timerId: number | null = null

  const tick = () => {
    if (cancelled) {
      return
    }

    onTick(remaining)

    if (remaining <= 0) {
      onComplete()
      return
    }

    remaining -= 1
    timerId = window.setTimeout(tick, 1000)
  }

  tick()

  return {
    cancel: () => {
      cancelled = true
      if (timerId !== null) {
        window.clearTimeout(timerId)
      }
    },
  }
}

export function canTriggerFromMidi(
  phase: JamSessionPhase,
  velocity: number,
): boolean {
  return phase === 'armed' && velocity > 0
}

export function nextPhaseAfterMidiTrigger(
  current: JamSessionPhase,
): JamSessionPhase {
  if (current === 'armed') {
    return 'countdown'
  }
  return current
}
