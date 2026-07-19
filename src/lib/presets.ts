import {
  DEFAULT_EFFECTS,
  DEFAULT_MIDI_MAPPINGS,
  PRESET_VERSION,
  type EffectSettings,
  type MidiMapping,
  type TonePreset,
} from '../types/preset'

export function createPreset(
  name: string,
  modelName: string,
  irName: string,
  effects: EffectSettings = DEFAULT_EFFECTS,
  midiMappings: MidiMapping[] = DEFAULT_MIDI_MAPPINGS,
  demoInputName?: string,
): TonePreset {
  return {
    version: PRESET_VERSION,
    name,
    modelName,
    irName,
    demoInputName,
    effects: { ...effects },
    midiMappings: midiMappings.map((mapping) => ({ ...mapping })),
    createdAt: new Date().toISOString(),
  }
}

export function serializePreset(preset: TonePreset): string {
  return JSON.stringify(preset, null, 2)
}

export function parsePreset(json: string): TonePreset {
  const data: unknown = JSON.parse(json)

  if (!isRecord(data)) {
    throw new Error('Preset must be a JSON object')
  }

  if (data.version !== PRESET_VERSION) {
    throw new Error(`Unsupported preset version: ${String(data.version)}`)
  }

  if (typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Preset name is required')
  }

  if (typeof data.modelName !== 'string') {
    throw new Error('Preset modelName is required')
  }

  if (typeof data.irName !== 'string') {
    throw new Error('Preset irName is required')
  }

  const effects = parseEffects(data.effects)
  const midiMappings = parseMidiMappings(data.midiMappings)

  return {
    version: PRESET_VERSION,
    name: data.name.trim(),
    modelName: data.modelName,
    irName: data.irName,
    demoInputName:
      typeof data.demoInputName === 'string' ? data.demoInputName : undefined,
    effects,
    midiMappings,
    createdAt:
      typeof data.createdAt === 'string'
        ? data.createdAt
        : new Date().toISOString(),
  }
}

function parseEffects(value: unknown): EffectSettings {
  if (!isRecord(value)) {
    throw new Error('Preset effects are invalid')
  }

  const clamp = (input: unknown, fallback: number) => {
    if (typeof input !== 'number' || Number.isNaN(input)) {
      return fallback
    }
    return Math.min(1, Math.max(0, input))
  }

  return {
    inputGain: clamp(value.inputGain, DEFAULT_EFFECTS.inputGain),
    outputGain: clamp(value.outputGain, DEFAULT_EFFECTS.outputGain),
    tone: clamp(value.tone, DEFAULT_EFFECTS.tone),
    reverbMix: clamp(value.reverbMix, DEFAULT_EFFECTS.reverbMix),
    reverbGain: clamp(value.reverbGain, DEFAULT_EFFECTS.reverbGain),
    bypass: Boolean(value.bypass),
  }
}

function parseMidiMappings(value: unknown): MidiMapping[] {
  if (!Array.isArray(value)) {
    return DEFAULT_MIDI_MAPPINGS.map((mapping) => ({ ...mapping }))
  }

  const allowedTargets = new Set<keyof EffectSettings>([
    'inputGain',
    'outputGain',
    'tone',
    'reverbMix',
    'reverbGain',
    'bypass',
  ])

  const mappings: MidiMapping[] = []

  for (const item of value) {
    if (!isRecord(item)) continue
    if (typeof item.cc !== 'number' || item.cc < 0 || item.cc > 127) continue
    if (typeof item.target !== 'string' || !allowedTargets.has(item.target as keyof EffectSettings)) {
      continue
    }
    mappings.push({
      cc: item.cc,
      target: item.target as keyof EffectSettings,
      label: typeof item.label === 'string' ? item.label : `CC ${item.cc}`,
    })
  }

  return mappings.length > 0
    ? mappings
    : DEFAULT_MIDI_MAPPINGS.map((mapping) => ({ ...mapping }))
}

export function downloadPreset(preset: TonePreset): void {
  const blob = new Blob([serializePreset(preset)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = preset.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  anchor.href = url
  anchor.download = `${safeName || 'shhhred-preset'}.shhhred.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
