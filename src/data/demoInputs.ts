import type { DemoInput, NonEmptyArray } from './catalog'

interface DemoTrackDefinition {
  id: string
  name: string
  file: string
  genre: DemoInput['genre']
  default?: boolean
}

const DEMO_TRACKS: DemoTrackDefinition[] = [
  {
    id: 'metalcore-guitar',
    name: 'Metalcore - Guitar',
    file: 'metalcore-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'decapitated-guitar',
    name: 'Decapitated - Guitar',
    file: 'decapitated-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'fast-thrash-guitar',
    name: 'Fast Thrash - Guitar',
    file: 'fast-thrash-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'groove-thrash-guitar',
    name: 'Groove Thrash - Guitar',
    file: 'groove-thrash-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'fear-guitar',
    name: 'Fear - Guitar',
    file: 'fear-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'power-thrash-guitar',
    name: 'Power Thrash - Guitar',
    file: 'power-thrash-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'hammer-lead-guitar',
    name: 'Hammer Lead - Guitar',
    file: 'hammer-lead-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'raid-guitar',
    name: 'Raid - Guitar',
    file: 'raid-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'tomb-guitar',
    name: 'Tomb - Guitar',
    file: 'tomb-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'power-guitar',
    name: 'Power - Guitar',
    file: 'power-guitar.wav',
    genre: 'metal',
  },
  {
    id: 'mayer-guitar',
    name: 'Mayer - Guitar',
    file: 'mayer-guitar.wav',
    genre: 'rock',
    default: true,
  },
  {
    id: 'brit-guitar',
    name: 'Brit - Guitar',
    file: 'brit-guitar.wav',
    genre: 'rock',
  },
  {
    id: 'pop-punk-guitar',
    name: 'Pop Punk - Guitar',
    file: 'pop-punk-guitar.wav',
    genre: 'rock',
  },
  {
    id: 'jazz-hop-guitar',
    name: 'Jazz Hop - Guitar',
    file: 'jazz-hop-guitar.wav',
    genre: 'blues',
  },
  {
    id: 'downtown-bass',
    name: 'Downtown - Bass',
    file: 'downtown-bass.wav',
    genre: 'bass',
  },
]

export function buildDemoInputs(base: string): NonEmptyArray<DemoInput> {
  return DEMO_TRACKS.map((track) => ({
    id: track.id,
    name: track.name,
    url: `${base}inputs/${track.file}`,
    genre: track.genre,
    ...(track.default ? { default: true } : {}),
  })) as NonEmptyArray<DemoInput>
}
