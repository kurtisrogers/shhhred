import { describe, expect, it } from 'vitest'
import {
  FACTORY_PRESETS,
  getFactoryPresetById,
  getFactoryPresetByName,
} from './factoryPresets'
import { AMP_MODELS, DEMO_INPUTS } from './catalog'

describe('factory presets', () => {
  it('includes heavy metal classics like the 5150 and Iommi', () => {
    const names = FACTORY_PRESETS.map((preset) => preset.name)
    expect(names).toContain('5150 Block Letter')
    expect(names).toContain('6505+ Red Channel')
    expect(names).toContain('JCM800 Crunch')
    expect(names).toContain('Iron Sabbath')
  })

  it('references valid catalog entries', () => {
    for (const preset of FACTORY_PRESETS) {
      expect(AMP_MODELS.some((model) => model.name === preset.modelName)).toBe(true)
      expect(DEMO_INPUTS.some((input) => input.name === preset.demoInputName)).toBe(
        true,
      )
    }
  })

  it('looks up presets by id and name', () => {
    expect(getFactoryPresetById('5150-block-boosted')?.modelName).toContain('5150')
    expect(getFactoryPresetByName('ENGL Savage')?.demoInputName).toBe(
      'Metalcore - Guitar',
    )
  })
})
