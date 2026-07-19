import { describe, expect, it } from 'vitest'
import {
  formatPlaybackTime,
  getPlaybackPhaseLabel,
  resolveDemoPlaybackStatus,
} from './demoPlayerStatus'

describe('resolveDemoPlaybackStatus', () => {
  const base = {
    initState: 'ready' as const,
    isPlaying: false,
    isActivePlayer: false,
    syncLoading: false,
    trackName: 'Mayer - Guitar',
    currentTime: 0,
    duration: 120,
    audioEnded: false,
    errorMessage: null,
  }

  it('reports loading while a track is being fetched', () => {
    const status = resolveDemoPlaybackStatus({
      ...base,
      syncLoading: true,
    })

    expect(status.phase).toBe('loading')
    expect(status.message).toContain('Mayer - Guitar')
  })

  it('reports initializing while the engine boots', () => {
    const status = resolveDemoPlaybackStatus({
      ...base,
      initState: 'initializing',
    })

    expect(status.phase).toBe('initializing')
    expect(status.message).toContain('Starting audio engine')
  })

  it('reports playing for the active player', () => {
    const status = resolveDemoPlaybackStatus({
      ...base,
      isPlaying: true,
      isActivePlayer: true,
      currentTime: 12,
    })

    expect(status.phase).toBe('playing')
    expect(status.isPlaying).toBe(true)
    expect(status.progress).toBeCloseTo(0.1)
  })

  it('reports paused when playback has started and stopped mid-track', () => {
    const status = resolveDemoPlaybackStatus({
      ...base,
      isActivePlayer: true,
      currentTime: 24,
    })

    expect(status.phase).toBe('paused')
    expect(status.message).toContain('Paused')
  })

  it('reports errors with a message', () => {
    const status = resolveDemoPlaybackStatus({
      ...base,
      errorMessage: 'Playback failed',
    })

    expect(status.phase).toBe('error')
    expect(status.message).toBe('Playback failed')
  })
})

describe('formatPlaybackTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatPlaybackTime(0)).toBe('0:00')
    expect(formatPlaybackTime(65)).toBe('1:05')
    expect(formatPlaybackTime(600)).toBe('10:00')
  })
})

describe('getPlaybackPhaseLabel', () => {
  it('maps phases to short labels', () => {
    expect(getPlaybackPhaseLabel('playing')).toBe('Playing')
    expect(getPlaybackPhaseLabel('paused')).toBe('Paused')
    expect(getPlaybackPhaseLabel('loading')).toBe('Loading')
  })
})
