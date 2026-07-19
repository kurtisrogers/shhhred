import { describe, expect, it } from 'vitest'
import { createPreset, parsePreset, serializePreset } from './presets'
import { DEFAULT_EFFECTS, PRESET_VERSION } from '../types/preset'

describe('preset serialization', () => {
  it('creates a versioned preset with defaults', () => {
    const preset = createPreset('Test Tone', 'Vox AC10', 'Celestion')

    expect(preset.version).toBe(PRESET_VERSION)
    expect(preset.name).toBe('Test Tone')
    expect(preset.effects).toEqual(DEFAULT_EFFECTS)
    expect(preset.createdAt).toBeTypeOf('string')
  })

  it('round-trips through JSON', () => {
    const preset = createPreset('Round Trip', 'Fender Deluxe Reverb', 'None', {
      ...DEFAULT_EFFECTS,
      inputGain: 0.42,
    })

    const parsed = parsePreset(serializePreset(preset))
    expect(parsed).toEqual(preset)
  })

  it('rejects invalid preset payloads', () => {
    expect(() => parsePreset('{"version":99}')).toThrow(/Unsupported preset version/)
    expect(() => parsePreset('{"version":1,"name":"","modelName":"x","irName":"y","effects":{}}')).toThrow(
      /Preset name is required/,
    )
  })
})
