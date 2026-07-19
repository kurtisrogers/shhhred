import { AMP_MODELS, CABINET_IRS, DEMO_INPUTS } from '../data/catalog'
import { DEFAULT_EFFECTS } from '../types/preset'

export const DEFAULT_STUDIO = {
  presetName: 'Untitled Tone',
  modelName: AMP_MODELS[0].name,
  irName: CABINET_IRS.find((ir) => ir.default)?.name ?? CABINET_IRS[0].name,
  demoInputName: DEMO_INPUTS.find((input) => input.default)?.name ?? DEMO_INPUTS[0].name,
  effects: DEFAULT_EFFECTS,
}
