import { useMemo } from 'react'
import {
  T3kPlayer,
  T3kPlayerProvider,
  PREVIEW_MODE,
  type IR,
  type Model,
} from 'neural-amp-modeler-wasm'
import 'neural-amp-modeler-wasm/dist/styles.css'
import type { EffectSettings } from '../types/preset'

const BASE = import.meta.env.BASE_URL

type NonEmptyArray<T> = [T, ...T[]]

export const MODELS: NonEmptyArray<Model> = [
  { name: 'Vox AC10', url: `${BASE}models/ac10.nam`, default: true },
  { name: 'Fender Deluxe Reverb', url: `${BASE}models/deluxe.nam` },
]

export const IRS: NonEmptyArray<IR> = [
  { name: 'None', url: '' },
  {
    name: 'Celestion',
    url: `${BASE}irs/celestion.wav`,
    default: true,
    mix: 0.35,
    gain: 1.0,
  },
  {
    name: 'EMT 140 Plate',
    url: `${BASE}irs/plate.wav`,
    mix: 0.45,
    gain: 1.0,
  },
]

interface NamPlayerProps {
  selectedModelName: string
  selectedIrName: string
  effects: EffectSettings
  onModelChange: (name: string) => void
  onIrChange: (name: string) => void
  onLiveStart: () => void
}

export function NamPlayer({
  selectedModelName,
  selectedIrName,
  effects,
  onModelChange,
  onIrChange,
  onLiveStart,
}: NamPlayerProps) {
  const models = useMemo((): NonEmptyArray<Model> => {
    return MODELS.map((model) => ({
      ...model,
      default: model.name === selectedModelName,
    })) as NonEmptyArray<Model>
  }, [selectedModelName])

  const irs = useMemo((): NonEmptyArray<IR> => {
    return IRS.map((ir) => {
      const selected = ir.name === selectedIrName
      if (!selected) {
        return { ...ir, default: false }
      }

      if (ir.name === 'None') {
        return { ...ir, default: true }
      }

      return {
        ...ir,
        default: true,
        mix: effects.reverbMix,
        gain: effects.reverbGain,
      }
    }) as NonEmptyArray<IR>
  }, [effects.reverbGain, effects.reverbMix, selectedIrName])

  return (
    <T3kPlayerProvider>
      <div className="nam-player-shell">
        <T3kPlayer
          models={models}
          irs={irs}
          previewMode={PREVIEW_MODE.MODEL}
          onModelChange={(model) => onModelChange(model.name)}
          onIrChange={(ir) => onIrChange(ir.name)}
          onPlayLive={() => onLiveStart()}
          infoSlot={
            <div className="nam-overlay">
              <span>Neural Amp Modeler</span>
              <strong>Live Input Ready</strong>
            </div>
          }
        />
      </div>
    </T3kPlayerProvider>
  )
}
