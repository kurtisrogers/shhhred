export type PlaybackHealth = 'idle' | 'audible' | 'silent'

export interface PlaybackHealthInput {
  isPlaying: boolean
  isActivePlayer: boolean
  audioContextState?: AudioContextState
  outputGainValue: number
  audioPaused: boolean
}

export function evaluatePlaybackHealth(input: PlaybackHealthInput): PlaybackHealth {
  if (!input.isPlaying || !input.isActivePlayer) {
    return 'idle'
  }

  if (input.audioPaused) {
    return 'silent'
  }

  if (input.audioContextState && input.audioContextState !== 'running') {
    return 'silent'
  }

  if (input.outputGainValue <= 0.001) {
    return 'silent'
  }

  return 'audible'
}
