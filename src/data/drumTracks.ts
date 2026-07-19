export interface DrumStep {
  kick?: boolean
  snare?: boolean
  hat?: boolean
}

export interface DrumTrack {
  id: string
  name: string
  bpm: number
  genre: string
  description: string
  steps: DrumStep[]
}

const METAL_THRASH: DrumStep[] = [
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { snare: true, hat: true },
  { hat: true },
]

const ROCK_GROOVE: DrumStep[] = [
  { kick: true },
  { hat: true },
  { hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true },
  { hat: true },
  { hat: true },
  { hat: true },
]

const DOUBLE_KICK: DrumStep[] = [
  { kick: true, hat: true },
  { kick: true, hat: true },
  { snare: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { snare: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { snare: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { kick: true, hat: true },
  { snare: true, hat: true },
]

const HALF_TIME: DrumStep[] = [
  { kick: true, hat: true },
  { hat: true },
  { hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { hat: true },
  { hat: true },
]

export const DRUM_TRACKS: DrumTrack[] = [
  {
    id: 'metal-thrash-140',
    name: 'Metal Thrash 140',
    bpm: 140,
    genre: 'metal',
    description: 'Driving thrash groove for 5150 riffing',
    steps: METAL_THRASH,
  },
  {
    id: 'double-kick-150',
    name: 'Double Kick 150',
    bpm: 150,
    genre: 'metal',
    description: 'Machine-gun double kick for extreme metal',
    steps: DOUBLE_KICK,
  },
  {
    id: 'rock-groove-110',
    name: 'Rock Groove 110',
    bpm: 110,
    genre: 'rock',
    description: 'Classic rock backbeat',
    steps: ROCK_GROOVE,
  },
  {
    id: 'half-time-90',
    name: 'Half-Time 90',
    bpm: 90,
    genre: 'rock',
    description: 'Slow half-time feel for heavy riffs',
    steps: HALF_TIME,
  },
]

export function getDrumTrackById(id: string): DrumTrack | undefined {
  return DRUM_TRACKS.find((track) => track.id === id)
}
