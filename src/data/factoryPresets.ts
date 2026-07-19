import { DEFAULT_EFFECTS, type EffectSettings } from '../types/preset'
import { AMP_MODELS, CABINET_IRS, DEMO_INPUTS } from './catalog'

export interface FactoryPreset {
  id: string
  name: string
  tagline: string
  modelName: string
  irName: string
  demoInputName: string
  effects: EffectSettings
}

export const FACTORY_PRESETS: FactoryPreset[] = [
  {
    id: 'midnight-crunch',
    name: 'Midnight Crunch',
    tagline: 'Vox chime with Celestion punch',
    modelName: 'Vox AC10',
    irName: 'Celestion 4x12',
    demoInputName: 'Mayer - Guitar',
    effects: DEFAULT_EFFECTS,
  },
  {
    id: 'blackface-spring',
    name: 'Blackface Spring',
    tagline: 'Deluxe cleans and plate reverb',
    modelName: 'Fender Deluxe Reverb',
    irName: 'EMT 140 Plate',
    demoInputName: 'Mayer - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.62,
      outputGain: 0.68,
      tone: 0.48,
      reverbMix: 0.55,
    },
  },
  {
    id: '5150-block-boosted',
    name: '5150 Block Letter',
    tagline: 'Classic Peavey 5150 boosted fury',
    modelName: 'Peavey 5150 Block Letter (Boosted)',
    irName: 'Celestion 4x12',
    demoInputName: 'Metalcore - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.88,
      outputGain: 0.78,
      tone: 0.72,
      reverbMix: 0.18,
    },
  },
  {
    id: '5150-rhythm',
    name: '5150 Rhythm Machine',
    tagline: 'Tight block-letter chunk for riffs',
    modelName: 'Peavey 5150 Block Letter (No Boost)',
    irName: 'Celestion 4x12',
    demoInputName: 'Fast Thrash - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.82,
      outputGain: 0.8,
      tone: 0.65,
      reverbMix: 0.1,
    },
  },
  {
    id: '6505-red-channel',
    name: '6505+ Red Channel',
    tagline: 'Modern Peavey red-channel aggression',
    modelName: 'Peavey 6505+ Red Channel',
    irName: 'Celestion 4x12',
    demoInputName: 'Power Thrash - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.9,
      outputGain: 0.76,
      tone: 0.7,
      reverbMix: 0.12,
    },
  },
  {
    id: 'jcm800-crunch',
    name: 'JCM800 Crunch',
    tagline: 'Marshall crunch for classic rock',
    modelName: 'Marshall JCM2000 Crunch',
    irName: 'Celestion 4x12',
    demoInputName: 'Mayer - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.78,
      outputGain: 0.72,
      tone: 0.58,
      reverbMix: 0.22,
    },
  },
  {
    id: 'jcm-lead',
    name: 'JCM Lead Solo',
    tagline: 'Singing Marshall sustain',
    modelName: 'Marshall JCM2000 Lead',
    irName: 'Celestion 4x12',
    demoInputName: 'Hammer Lead - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.85,
      outputGain: 0.74,
      tone: 0.66,
      reverbMix: 0.2,
    },
  },
  {
    id: 'mesa-mark-iv',
    name: 'Mesa Mark IV Lead',
    tagline: 'Liquid Mesa saturation',
    modelName: 'Mesa Mark IV',
    irName: 'Celestion 4x12',
    demoInputName: 'Hammer Lead - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.84,
      outputGain: 0.73,
      tone: 0.68,
      reverbMix: 0.16,
    },
  },
  {
    id: 'soldano-slo',
    name: 'Soldano SLO Crunch',
    tagline: 'Smooth super-lead articulation',
    modelName: 'Soldano SLO',
    irName: 'Celestion 4x12',
    demoInputName: 'Mayer - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.8,
      outputGain: 0.7,
      tone: 0.62,
      reverbMix: 0.24,
    },
  },
  {
    id: 'engl-savage',
    name: 'ENGL Savage',
    tagline: 'Precision German metal',
    modelName: 'ENGL Savage',
    irName: 'Celestion 4x12',
    demoInputName: 'Metalcore - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.92,
      outputGain: 0.77,
      tone: 0.74,
      reverbMix: 0.1,
    },
  },
  {
    id: 'orange-rockerverb',
    name: 'Orange Rockerverb',
    tagline: 'Thick British roar',
    modelName: 'Orange Rockerverb',
    irName: 'Celestion 4x12',
    demoInputName: 'Mayer - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.76,
      outputGain: 0.71,
      tone: 0.6,
      reverbMix: 0.28,
    },
  },
  {
    id: 'friedman-brown',
    name: 'Friedman Brown Sound',
    tagline: 'Brown-sound inspired saturation',
    modelName: 'Friedman DSM',
    irName: 'Celestion 4x12',
    demoInputName: 'Fast Thrash - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.86,
      outputGain: 0.75,
      tone: 0.64,
      reverbMix: 0.14,
    },
  },
  {
    id: 'iommi-sabbath',
    name: 'Iron Sabbath',
    tagline: 'Tony Iommi Laney doom and darkness',
    modelName: 'Laney GH100TI Iommi',
    irName: 'Celestion 4x12',
    demoInputName: 'Power Thrash - Guitar',
    effects: {
      ...DEFAULT_EFFECTS,
      inputGain: 0.84,
      outputGain: 0.74,
      tone: 0.52,
      reverbMix: 0.12,
    },
  },
]

export const DEFAULT_FACTORY_PRESET = FACTORY_PRESETS[0]

export function getFactoryPresetById(id: string): FactoryPreset | undefined {
  return FACTORY_PRESETS.find((preset) => preset.id === id)
}

export function getFactoryPresetByName(name: string): FactoryPreset | undefined {
  return FACTORY_PRESETS.find((preset) => preset.name === name)
}

export const AMP_MODEL_NAMES = AMP_MODELS.map((model) => model.name)
export const CABINET_IR_NAMES = CABINET_IRS.map((ir) => ir.name)
export const DEMO_INPUT_NAMES = DEMO_INPUTS.map((input) => input.name)
