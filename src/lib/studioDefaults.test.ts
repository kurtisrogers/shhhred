import { describe, expect, it } from 'vitest'
import { DEFAULT_STUDIO } from './studioDefaults'

describe('studioDefaults', () => {
  it('provides neutral starting values for experimentation', () => {
    expect(DEFAULT_STUDIO.presetName).toBe('Untitled Tone')
    expect(DEFAULT_STUDIO.modelName).toBe('Vox AC10')
    expect(DEFAULT_STUDIO.irName).toBe('Celestion 4x12')
    expect(DEFAULT_STUDIO.demoInputName).toBe('Mayer - Guitar')
  })
})
