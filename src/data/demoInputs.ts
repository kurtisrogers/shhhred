import type { DemoInput, NonEmptyArray } from './catalog'

const NAM_DEMO_BASE =
  'https://raw.githubusercontent.com/tone-3000/neural-amp-modeler-wasm/main/ui/public/inputs/'

const LOCAL_DEMO_FILES: Record<string, string> = {
  'Mayer - Guitar': 'mayer-guitar.wav',
  'Metalcore - Guitar': 'metalcore-guitar.wav',
  'Fast Thrash - Guitar': 'fast-thrash-guitar.wav',
  'Power Thrash - Guitar': 'power-thrash-guitar.wav',
  'Hammer Lead - Guitar': 'hammer-lead-guitar.wav',
}

function demoInputUrl(base: string, displayName: string, remoteFile: string): string {
  const localFile = LOCAL_DEMO_FILES[displayName]
  if (localFile) {
    return `${base}inputs/${localFile}`
  }

  return `${NAM_DEMO_BASE}${encodeURIComponent(remoteFile)}`
}

function guitar(
  base: string,
  id: string,
  name: string,
  remoteFile: string,
  options?: { default?: boolean },
): DemoInput {
  return {
    id,
    name,
    url: demoInputUrl(base, name, remoteFile),
    genre: 'rock',
    ...options,
  }
}

function bass(
  base: string,
  id: string,
  name: string,
  remoteFile: string,
): DemoInput {
  return {
    id,
    name,
    url: demoInputUrl(base, name, remoteFile),
    genre: 'bass',
  }
}

export function buildDemoInputs(base: string): NonEmptyArray<DemoInput> {
  return [
    guitar(base, 'mayer-guitar', 'Mayer - Guitar', 'Mayer - Guitar.wav', {
      default: true,
    }),
    guitar(base, 'brit-guitar', 'Brit - Guitar', 'Brit - Guitar.wav'),
    guitar(base, 'celestial-guitar', 'Celestial - Guitar', 'Celestial - Guitar.wav'),
    guitar(base, 'cream-guitar', 'Cream - Guitar', 'Cream - Guitar.wav'),
    guitar(base, 'decapitated-guitar', 'Decapitated - Guitar', 'Decapitated - Guitar.wav'),
    guitar(base, 'fast-thrash-guitar', 'Fast Thrash - Guitar', 'Fast Thrash - Guitar.wav'),
    guitar(base, 'fear-guitar', 'Fear - Guitar', 'Fear - Guitar.wav'),
    guitar(base, 'groove-thrash-guitar', 'Groove Thrash - Guitar', 'Groove Thrash - Guitar.wav'),
    guitar(base, 'hammer-lead-guitar', 'Hammer Lead - Guitar', 'Hammer Lead - Guitar.wav'),
    guitar(base, 'harmonics-guitar', 'Harmonics - Guitar', 'Harmonics - Guitar.wav'),
    guitar(base, 'honky-guitar', 'Honky - Guitar', 'Honky - Guitar.wav'),
    guitar(base, 'hotrod-guitar', 'Hotrod - Guitar', 'Hotrod - Guitar.wav'),
    guitar(base, 'jazz-hop-guitar', 'Jazz Hop - Guitar', 'Jazz Hop - Guitar.wav'),
    guitar(base, 'jazz-trot-guitar', 'Jazz Trot - Guitar', 'Jazz Trot - Guitar.wav'),
    guitar(base, 'john-guitar', 'John - Guitar', 'John - Guitar.wav'),
    guitar(base, 'lunar-guitar', 'Lunar - Guitar', 'Lunar - Guitar.wav'),
    guitar(base, 'metalcore-guitar', 'Metalcore - Guitar', 'Metalcore - Guitar.wav'),
    guitar(base, 'pluck-guitar', 'Pluck - Guitar', 'Pluck - Guitar.wav'),
    guitar(base, 'pop-punk-guitar', 'Pop Punk - Guitar', 'Pop Punk - Guitar.wav'),
    guitar(base, 'power-guitar', 'Power - Guitar', 'Power - Guitar.wav'),
    guitar(base, 'power-thrash-guitar', 'Power Thrash - Guitar', 'Power Thrash - Guitar.wav'),
    guitar(
      base,
      'progression-guitar',
      'Progression -  Guitar',
      'Progression -  Guitar.wav',
    ),
    guitar(base, 'raid-guitar', 'Raid - Guitar', 'Raid - Guitar.wav'),
    guitar(base, 'rotary-guitar', 'Rotary - Guitar', 'Rotary - Guitar.wav'),
    guitar(base, 'slide-lead-guitar', 'Slide Lead - Guitar', 'Slide Lead - Guitar.wav'),
    guitar(base, 'smooth-guitar', 'Smooth - Guitar', 'Smooth - Guitar.wav'),
    guitar(base, 'stroke-guitar', 'Stroke - Guitar', 'Stroke - Guitar.wav'),
    guitar(base, 'tomb-guitar', 'Tomb - Guitar', 'Tomb - Guitar.wav'),
    bass(base, 'downtown-bass', 'Downtown - Bass', 'Downtown - Bass.wav'),
    bass(base, 'drivin-bass', "Drivin' - Bass", "Drivin' - Bass.wav"),
    bass(base, 'frogger-bass', 'Frogger - Bass', 'Frogger - Bass.wav'),
    bass(base, 'garden-bass', 'Garden - Bass', 'Garden - Bass.wav'),
    bass(base, 'rollin-bass', "Rollin' - Bass", "Rollin' - Bass.wav"),
    bass(base, 'smokin-bass', "Smokin' - Bass", "Smokin' - Bass.wav"),
  ]
}
