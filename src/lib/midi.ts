import type { EffectSettings, MidiMapping } from '../types/preset'

export interface MidiDeviceInfo {
  id: string
  name: string
  manufacturer: string
}

export interface MidiNoteEvent {
  note: number
  velocity: number
  channel: number
}

export type MidiCcHandler = (cc: number, value: number) => void
export type MidiNoteHandler = (event: MidiNoteEvent) => void

export function ccValueToNormalized(value: number): number {
  return Math.min(1, Math.max(0, value / 127))
}

export function applyMidiCc(
  effects: EffectSettings,
  mappings: MidiMapping[],
  cc: number,
  value: number,
): EffectSettings {
  const mapping = mappings.find((item) => item.cc === cc)
  if (!mapping) {
    return effects
  }

  const normalized = ccValueToNormalized(value)

  if (mapping.target === 'bypass') {
    return { ...effects, bypass: normalized >= 0.5 }
  }

  return { ...effects, [mapping.target]: normalized }
}

export function midiNoteToName(note: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(note / 12) - 1
  const name = names[note % 12]
  return `${name}${octave}`
}

export function isWebMidiSupported(): boolean {
  return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator
}
