import { describe, expect, it } from 'vitest'
import { applyMidiCc, ccValueToNormalized, midiNoteToName } from './midi'
import { DEFAULT_EFFECTS, DEFAULT_MIDI_MAPPINGS } from '../types/preset'

describe('midi utilities', () => {
  it('normalizes CC values between 0 and 1', () => {
    expect(ccValueToNormalized(0)).toBe(0)
    expect(ccValueToNormalized(127)).toBe(1)
    expect(ccValueToNormalized(64)).toBeCloseTo(64 / 127)
  })

  it('maps MIDI notes to note names', () => {
    expect(midiNoteToName(60)).toBe('C4')
    expect(midiNoteToName(61)).toBe('C#4')
  })

  it('applies mapped CC values to effect settings', () => {
    const next = applyMidiCc(DEFAULT_EFFECTS, DEFAULT_MIDI_MAPPINGS, 7, 127)
    expect(next.outputGain).toBe(1)
    expect(next.inputGain).toBe(DEFAULT_EFFECTS.inputGain)
  })

  it('toggles bypass when mapped CC crosses halfway', () => {
    const mappings = [{ cc: 64, target: 'bypass' as const, label: 'Bypass' }]
    const on = applyMidiCc(DEFAULT_EFFECTS, mappings, 64, 100)
    const off = applyMidiCc(DEFAULT_EFFECTS, mappings, 64, 10)

    expect(on.bypass).toBe(true)
    expect(off.bypass).toBe(false)
  })
})
