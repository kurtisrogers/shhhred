import { useMemo } from 'react'
import {
  T3kPlayer,
  T3kPlayerProvider,
  PREVIEW_MODE,
  type Input,
  type IR,
  type Model,
} from 'neural-amp-modeler-wasm'
import 'neural-amp-modeler-wasm/dist/styles.css'
import {
  AMP_MODELS,
  CABINET_IRS,
  DEMO_INPUTS,
  type NonEmptyArray,
} from '../data/catalog'
import type { EffectSettings } from '../types/preset'
import { NAM_PLAYER_ID, NamPlayerSync } from './NamPlayerSync'

interface NamPlayerProps {
  selectedModelName: string
  selectedIrName: string
  selectedDemoInputName: string
  effects: EffectSettings
  onModelChange: (name: string) => void
  onIrChange: (name: string) => void
  onDemoInputChange: (name: string) => void
  onDemoStart: () => void
  onLiveStart: () => void
}

export function NamPlayer({
  selectedModelName,
  selectedIrName,
  selectedDemoInputName,
  effects,
  onModelChange,
  onIrChange,
  onDemoInputChange,
  onDemoStart,
  onLiveStart,
}: NamPlayerProps) {
  const models = useMemo((): NonEmptyArray<Model> => {
    return AMP_MODELS.map((model) => ({
      name: model.name,
      url: model.url,
      default: model.name === selectedModelName,
    })) as NonEmptyArray<Model>
  }, [selectedModelName])

  const irs = useMemo((): NonEmptyArray<IR> => {
    return CABINET_IRS.map((ir) => {
      const selected = ir.name === selectedIrName
      if (!selected) {
        return { name: ir.name, url: ir.url, default: false }
      }

      if (ir.name === 'None') {
        return { name: ir.name, url: ir.url, default: true }
      }

      return {
        name: ir.name,
        url: ir.url,
        default: true,
        mix: effects.reverbMix,
        gain: effects.reverbGain,
      }
    }) as NonEmptyArray<IR>
  }, [effects.reverbGain, effects.reverbMix, selectedIrName])

  const inputs = useMemo((): NonEmptyArray<Input> => {
    return DEMO_INPUTS.map((input) => ({
      name: input.name,
      url: input.url,
      default: input.name === selectedDemoInputName,
    })) as NonEmptyArray<Input>
  }, [selectedDemoInputName])

  return (
    <T3kPlayerProvider>
      <NamPlayerSync
        selectedModelName={selectedModelName}
        selectedIrName={selectedIrName}
        selectedDemoInputName={selectedDemoInputName}
        effects={effects}
      />
      <NamPlayerSurface
        models={models}
        irs={irs}
        inputs={inputs}
        onModelChange={onModelChange}
        onIrChange={onIrChange}
        onDemoInputChange={onDemoInputChange}
        onDemoStart={onDemoStart}
        onLiveStart={onLiveStart}
      />
    </T3kPlayerProvider>
  )
}

interface NamPlayerSurfaceProps {
  models: NonEmptyArray<Model>
  irs: NonEmptyArray<IR>
  inputs: NonEmptyArray<Input>
  onModelChange: (name: string) => void
  onIrChange: (name: string) => void
  onDemoInputChange: (name: string) => void
  onDemoStart: () => void
  onLiveStart: () => void
}

function NamPlayerSurface({
  models,
  irs,
  inputs,
  onModelChange,
  onIrChange,
  onDemoInputChange,
  onDemoStart,
  onLiveStart,
}: NamPlayerSurfaceProps) {
  return (
    <div className="nam-player-shell" data-testid="nam-player">
      <T3kPlayer
        id={NAM_PLAYER_ID}
        models={models}
        irs={irs}
        inputs={inputs}
        previewMode={PREVIEW_MODE.MODEL}
        onModelChange={(model) => onModelChange(model.name)}
        onIrChange={(ir) => onIrChange(ir.name)}
        onInputChange={(input) => onDemoInputChange(input.name)}
        onPlayDemo={() => onDemoStart()}
        onPlayLive={() => onLiveStart()}
        infoSlot={
          <div className="nam-overlay">
            <span>Neural Amp Modeler</span>
            <strong>Demo + Live Input Ready</strong>
          </div>
        }
      />
    </div>
  )
}
