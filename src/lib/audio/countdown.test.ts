import { describe, expect, it, vi } from 'vitest'
import {
  canTriggerFromMidi,
  startCountdown,
} from './countdown'

describe('countdown', () => {
  it('only triggers from armed phase with velocity', () => {
    expect(canTriggerFromMidi('armed', 100)).toBe(true)
    expect(canTriggerFromMidi('armed', 0)).toBe(false)
    expect(canTriggerFromMidi('countdown', 100)).toBe(false)
    expect(canTriggerFromMidi('playing', 100)).toBe(false)
  })

  it('counts down and completes', () => {
    vi.useFakeTimers()
    const ticks: number[] = []
    let completed = false

    const controller = startCountdown(
      3,
      (remaining) => ticks.push(remaining),
      () => {
        completed = true
      },
    )

    expect(ticks).toEqual([3])
    vi.advanceTimersByTime(3000)
    expect(ticks).toEqual([3, 2, 1, 0])
    expect(completed).toBe(true)

    controller.cancel()
    vi.useRealTimers()
  })
})
