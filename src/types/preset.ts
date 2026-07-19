export const PRESET_VERSION = 1 as const

export interface EffectSettings {
  inputGain: number
  outputGain: number
  tone: number
  reverbMix: number
  reverbGain: number
  bypass: boolean
}

export interface MidiMapping {
  cc: number
  target: keyof EffectSettings
  label: string
}

export interface TonePreset {
  version: typeof PRESET_VERSION
  name: string
  modelName: string
  irName: string
  effects: EffectSettings
  midiMappings: MidiMapping[]
  createdAt: string
}

export const DEFAULT_EFFECTS: EffectSettings = {
  inputGain: 0.75,
  outputGain: 0.7,
  tone: 0.55,
  reverbMix: 0.35,
  reverbGain: 1.0,
  bypass: false,
}

export const DEFAULT_MIDI_MAPPINGS: MidiMapping[] = [
  { cc: 1, target: 'inputGain', label: 'Mod Wheel → Input Gain' },
  { cc: 7, target: 'outputGain', label: 'Volume → Master' },
  { cc: 74, target: 'tone', label: 'Brightness → Tone' },
  { cc: 91, target: 'reverbMix', label: 'Reverb → Wet Mix' },
]
