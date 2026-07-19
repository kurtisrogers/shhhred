import { useCallback, useMemo, useState } from 'react'
import {
  T3kPlayer,
  T3kPlayerProvider,
  PREVIEW_MODE,
  useT3kPlayerContext,
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
import type { DemoPlaybackSnapshot, SyncLoadingState } from '../lib/demoPlayerStatus'
import type { EffectSettings } from '../types/preset'
import { DemoPlaybackStatus } from './DemoPlaybackStatus'
import { NAM_PLAYER_ID, NamPlayerSync } from './NamPlayerSync'

interface NamPlayerProps {
  selectedModelName: string
  selectedIrName: string
  selectedDemoInputName: string
  effects: EffectSettings
  onModelChange: (name: string) => void
  onIrChange: (name: string) => void
  onDemoInputChange: (name: string) => void
  onPlaybackStatusChange?: (status: DemoPlaybackSnapshot) => void
}

export function NamPlayer({
  selectedModelName,
  selectedIrName,
  selectedDemoInputName,
  effects,
  onModelChange,
  onIrChange,
  onDemoInputChange,
  onPlaybackStatusChange,
}: NamPlayerProps) {
  const [syncState, setSyncState] = useState<SyncLoadingState>({
    loading: false,
    reason: null,
  })
  const [syncError, setSyncError] = useState<string | null>(null)

  const handleSyncLoadingChange = useCallback((state: SyncLoadingState) => {
    setSyncState(state)
  }, [])

  const handlePlaybackStatusChange = useCallback(
    (status: DemoPlaybackSnapshot) => {
      onPlaybackStatusChange?.(status)
    },
    [onPlaybackStatusChange],
  )
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
    const selected =
      DEMO_INPUTS.find((input) => input.name === selectedDemoInputName) ??
      DEMO_INPUTS[0]

    return [
      {
        name: selected.name,
        url: selected.url,
        default: true,
      },
    ]
  }, [selectedDemoInputName])

  return (
    <T3kPlayerProvider>
      <NamPlayerSync
        selectedModelName={selectedModelName}
        selectedIrName={selectedIrName}
        selectedDemoInputName={selectedDemoInputName}
        effects={effects}
        onSyncLoadingChange={handleSyncLoadingChange}
        onSyncError={setSyncError}
      />
      <DemoPlaybackStatus
        trackName={selectedDemoInputName}
        syncLoading={syncState.loading}
        syncLoadingReason={syncState.reason}
        errorMessage={syncError}
        onStatusChange={handlePlaybackStatusChange}
      />
      <NamPlayerSurface
        selectedDemoInputName={selectedDemoInputName}
        models={models}
        irs={irs}
        inputs={inputs}
        onModelChange={onModelChange}
        onIrChange={onIrChange}
        onDemoInputChange={onDemoInputChange}
      />
    </T3kPlayerProvider>
  )
}

interface NamPlayerSurfaceProps {
  selectedDemoInputName: string
  models: NonEmptyArray<Model>
  irs: NonEmptyArray<IR>
  inputs: NonEmptyArray<Input>
  onModelChange: (name: string) => void
  onIrChange: (name: string) => void
  onDemoInputChange: (name: string) => void
}

function NamPlayerSurface({
  selectedDemoInputName,
  models,
  irs,
  inputs,
  onModelChange,
  onIrChange,
  onDemoInputChange,
}: NamPlayerSurfaceProps) {
  const { audioState } = useT3kPlayerContext()
  const playerKey =
    audioState.initState === 'ready' ? NAM_PLAYER_ID : selectedDemoInputName

  return (
    <div className="nam-player-shell" data-testid="nam-player">
      <T3kPlayer
        key={playerKey}
        id={NAM_PLAYER_ID}
        models={models}
        irs={irs}
        inputs={inputs}
        previewMode={PREVIEW_MODE.MODEL}
        onModelChange={(model) => onModelChange(model.name)}
        onIrChange={(ir) => onIrChange(ir.name)}
        onInputChange={(input) => onDemoInputChange(input.name)}
      />
    </div>
  )
}
