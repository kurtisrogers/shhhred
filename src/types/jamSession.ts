export type JamSessionPhase =
  | 'idle'
  | 'armed'
  | 'countdown'
  | 'playing'
  | 'recording'

export type RecordingFormat = 'webm' | 'wav' | 'ogg'

export interface JamSessionSettings {
  countdownSeconds: number
  drumTrackId: string
  drumVolume: number
  recordingFormat: RecordingFormat
  autoRecord: boolean
}

export const DEFAULT_JAM_SETTINGS: JamSessionSettings = {
  countdownSeconds: 5,
  drumTrackId: 'metal-thrash-140',
  drumVolume: 0.7,
  recordingFormat: 'wav',
  autoRecord: true,
}

export const COUNTDOWN_MIN_SECONDS = 1
export const COUNTDOWN_MAX_SECONDS = 15

export const RECORDING_FORMATS: Array<{
  id: RecordingFormat
  label: string
  mimeType: string
  extension: string
}> = [
  {
    id: 'wav',
    label: 'WAV (uncompressed)',
    mimeType: 'audio/wav',
    extension: 'wav',
  },
  {
    id: 'webm',
    label: 'WebM (Opus)',
    mimeType: 'audio/webm;codecs=opus',
    extension: 'webm',
  },
  {
    id: 'ogg',
    label: 'OGG (Opus)',
    mimeType: 'audio/ogg;codecs=opus',
    extension: 'ogg',
  },
]
