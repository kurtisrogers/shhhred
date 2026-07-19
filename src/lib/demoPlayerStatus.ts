export type AudioInitState = 'uninitialized' | 'initializing' | 'ready'

export type DemoPlaybackPhase =
  | 'idle'
  | 'initializing'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'error'

export interface DemoPlaybackSnapshot {
  phase: DemoPlaybackPhase
  message: string
  trackName: string
  currentTime: number
  duration: number
  progress: number
  isPlaying: boolean
}

export function formatPlaybackTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

interface ResolveDemoPlaybackStatusInput {
  initState: AudioInitState
  isPlaying: boolean
  isActivePlayer: boolean
  syncLoading: boolean
  trackName: string
  currentTime: number
  duration: number
  audioEnded: boolean
  errorMessage?: string | null
}

export function resolveDemoPlaybackStatus(
  input: ResolveDemoPlaybackStatusInput,
): DemoPlaybackSnapshot {
  const {
    initState,
    isPlaying,
    isActivePlayer,
    syncLoading,
    trackName,
    currentTime,
    duration,
    audioEnded,
    errorMessage,
  } = input

  const progress =
    duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0

  if (errorMessage) {
    return {
      phase: 'error',
      message: errorMessage,
      trackName,
      currentTime,
      duration,
      progress,
      isPlaying: false,
    }
  }

  if (syncLoading) {
    return {
      phase: 'loading',
      message: `Loading “${trackName}”…`,
      trackName,
      currentTime,
      duration,
      progress,
      isPlaying: false,
    }
  }

  if (initState === 'initializing') {
    return {
      phase: 'initializing',
      message: 'Starting audio engine…',
      trackName,
      currentTime,
      duration,
      progress,
      isPlaying: false,
    }
  }

  if (isPlaying && isActivePlayer) {
    return {
      phase: 'playing',
      message: `Playing “${trackName}”`,
      trackName,
      currentTime,
      duration,
      progress,
      isPlaying: true,
    }
  }

  if (
    initState === 'ready' &&
    isActivePlayer &&
    currentTime > 0 &&
    !audioEnded
  ) {
    return {
      phase: 'paused',
      message: `Paused — “${trackName}”`,
      trackName,
      currentTime,
      duration,
      progress,
      isPlaying: false,
    }
  }

  return {
    phase: 'idle',
    message: 'Ready — press play to audition',
    trackName,
    currentTime,
    duration,
    progress,
    isPlaying: false,
  }
}

export function getPlaybackPhaseLabel(phase: DemoPlaybackPhase): string {
  switch (phase) {
    case 'idle':
      return 'Ready'
    case 'initializing':
      return 'Starting'
    case 'loading':
      return 'Loading'
    case 'playing':
      return 'Playing'
    case 'paused':
      return 'Paused'
    case 'error':
      return 'Error'
    default: {
      const unreachable: never = phase
      return unreachable
    }
  }
}
