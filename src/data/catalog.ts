import type { IR, Input, Model } from 'neural-amp-modeler-wasm'
import { buildDemoInputs } from './demoInputs'

const BASE = import.meta.env.BASE_URL

export type NonEmptyArray<T> = [T, ...T[]]

export interface AmpModel extends Model {
  id: string
  category: 'clean' | 'crunch' | 'high-gain' | 'metal'
  description: string
}

export interface CabinetIr extends IR {
  id: string
}

export interface DemoInput extends Input {
  id: string
  genre: 'rock' | 'metal' | 'blues' | 'bass'
}

export const AMP_MODELS: NonEmptyArray<AmpModel> = [
  {
    id: 'vox-ac10',
    name: 'Vox AC10',
    url: `${BASE}models/ac10.nam`,
    category: 'crunch',
    description: 'British chime and edge-of-breakup warmth.',
  },
  {
    id: 'fender-deluxe',
    name: 'Fender Deluxe Reverb',
    url: `${BASE}models/deluxe.nam`,
    category: 'clean',
    description: 'Classic blackface cleans with spring shimmer.',
  },
  {
    id: 'peavey-5150-block-boosted',
    name: 'Peavey 5150 Block Letter (Boosted)',
    url: `${BASE}models/peavey-5150-block-boosted.nam`,
    category: 'metal',
    description: 'Aggressive block-letter 5150 with boosted front end.',
  },
  {
    id: 'peavey-5150-block-clean',
    name: 'Peavey 5150 Block Letter (No Boost)',
    url: `${BASE}models/peavey-5150-block-clean.nam`,
    category: 'high-gain',
    description: 'Tighter low end and more amp dynamics.',
  },
  {
    id: 'peavey-6505-red',
    name: 'Peavey 6505+ Red Channel',
    url: `${BASE}models/peavey-6505-red.nam`,
    category: 'metal',
    description: 'Modern red-channel fury for rhythm and leads.',
  },
  {
    id: 'marshall-jcm2000-crunch',
    name: 'Marshall JCM2000 Crunch',
    url: `${BASE}models/marshall-jcm2000-crunch.nam`,
    category: 'crunch',
    description: 'British crunch with punchy mids.',
  },
  {
    id: 'marshall-jcm2000-lead',
    name: 'Marshall JCM2000 Lead',
    url: `${BASE}models/marshall-jcm2000-lead.nam`,
    category: 'high-gain',
    description: 'Singing sustain and classic Marshall grind.',
  },
  {
    id: 'mesa-mark-iv',
    name: 'Mesa Mark IV',
    url: `${BASE}models/mesa-mark-iv.nam`,
    category: 'high-gain',
    description: 'Thick modded-Mesa saturation and liquid leads.',
  },
  {
    id: 'soldano-slo',
    name: 'Soldano SLO',
    url: `${BASE}models/soldano-slo.nam`,
    category: 'high-gain',
    description: 'Smooth, articulate super-lead overdrive.',
  },
  {
    id: 'engl-savage',
    name: 'ENGL Savage',
    url: `${BASE}models/engl-savage.nam`,
    category: 'metal',
    description: 'Tight German high-gain precision.',
  },
  {
    id: 'orange-rockerverb',
    name: 'Orange Rockerverb',
    url: `${BASE}models/orange-rockerverb.nam`,
    category: 'crunch',
    description: 'Thick orange mids and vintage roar.',
  },
  {
    id: 'friedman-dsm',
    name: 'Friedman DSM',
    url: `${BASE}models/friedman-dsm.nam`,
    category: 'high-gain',
    description: 'Brown-sound inspired saturation.',
  },
  {
    id: 'laney-gh100ti',
    name: 'Laney GH100TI',
    url: `${BASE}models/laney-gh100ti.nam`,
    category: 'metal',
    description:
      'Tony Iommi TI100 head — Adam D Killswitch Engage Incarnate rhythm tone.',
  },
]

export const CABINET_IRS: NonEmptyArray<CabinetIr> = [
  { id: 'none', name: 'None', url: '' },
  {
    id: 'celestion',
    name: 'Celestion 4x12',
    url: `${BASE}irs/celestion.wav`,
    default: true,
    mix: 0.35,
    gain: 1.0,
  },
  {
    id: 'plate',
    name: 'EMT 140 Plate',
    url: `${BASE}irs/plate.wav`,
    mix: 0.45,
    gain: 1.0,
  },
]

export const DEMO_INPUTS = buildDemoInputs(BASE)

export const DEMO_GUITAR_INPUTS = DEMO_INPUTS.filter((input) => input.genre !== 'bass')
export const DEMO_BASS_INPUTS = DEMO_INPUTS.filter((input) => input.genre === 'bass')
export const DEMO_INPUT_NAMES = DEMO_INPUTS.map((input) => input.name)
export const CABINET_IR_NAMES = CABINET_IRS.map((ir) => ir.name)

export function getAmpByName(name: string): AmpModel | undefined {
  return AMP_MODELS.find((model) => model.name === name)
}

export function getIrByName(name: string): CabinetIr | undefined {
  return CABINET_IRS.find((ir) => ir.name === name)
}

export function getDemoInputByName(name: string): DemoInput | undefined {
  return DEMO_INPUTS.find((input) => input.name === name)
}
