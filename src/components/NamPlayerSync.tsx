import { useEffect, useRef } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'
import {
  getAmpByName,
  getDemoInputByName,
  getIrByName,
} from '../data/catalog'
import type { EffectSettings } from '../types/preset'
import type { SyncLoadingReason, SyncLoadingState } from '../lib/demoPlayerStatus'

export const NAM_PLAYER_ID = 'shhhred-main-player'

export type { SyncLoadingReason, SyncLoadingState }

interface NamPlayerSyncProps {
  selectedModelName: string
  selectedIrName: string
  selectedDemoInputName: string
  effects: EffectSettings
  onSyncLoadingChange?: (state: SyncLoadingState) => void
  onSyncError?: (message: string | null) => void
}

export function NamPlayerSync({
  selectedModelName,
  selectedIrName,
  selectedDemoInputName,
  effects,
  onSyncLoadingChange,
  onSyncError,
}: NamPlayerSyncProps) {
  const {
    audioState,
    getAudioNodes,
    loadAudio,
    loadModel,
    loadIr,
    removeIr,
    setBypass,
    setPlaying,
  } = useT3kPlayerContext()

  const audioReady = audioState.initState === 'ready' && audioState.audioUrl !== null
  const syncTokenRef = useRef(0)
  const playbackRef = useRef(false)

  playbackRef.current =
    audioState.isPlaying && audioState.activePlayerId === NAM_PLAYER_ID

  const prevEngineSettingsRef = useRef({
    modelName: selectedModelName,
    irName: selectedIrName,
    bypass: effects.bypass,
    reverbMix: effects.reverbMix,
    reverbGain: effects.reverbGain,
  })

  useEffect(() => {
    if (!audioReady) {
      return
    }

    const prev = prevEngineSettingsRef.current
    const modelChanged = prev.modelName !== selectedModelName
    const irChanged = prev.irName !== selectedIrName
    const bypassChanged = prev.bypass !== effects.bypass
    const reverbChanged =
      prev.reverbMix !== effects.reverbMix ||
      prev.reverbGain !== effects.reverbGain

    if (!modelChanged && !irChanged && !bypassChanged && !reverbChanged) {
      return
    }

    const wasPlaying = playbackRef.current
    const showLoading = modelChanged || irChanged || reverbChanged
    const token = ++syncTokenRef.current

    prevEngineSettingsRef.current = {
      modelName: selectedModelName,
      irName: selectedIrName,
      bypass: effects.bypass,
      reverbMix: effects.reverbMix,
      reverbGain: effects.reverbGain,
    }

    const model = getAmpByName(selectedModelName)
    const ir = getIrByName(selectedIrName)
    if (!model || !ir) {
      return
    }

    let cancelled = false

    if (showLoading) {
      onSyncLoadingChange?.({ loading: true, reason: 'engine' })
      onSyncError?.(null)
    }

    const syncEngine = async () => {
      try {
        if (modelChanged) {
          await loadModel(model.url)
        }

        if (irChanged || reverbChanged) {
          if (ir.url) {
            await loadIr({
              url: ir.url,
              mix: effects.reverbMix,
              gain: effects.reverbGain,
            })
          } else {
            removeIr()
          }
        }

        if (bypassChanged) {
          setBypass(effects.bypass)
        }

        if (!cancelled && wasPlaying) {
          setPlaying(true, NAM_PLAYER_ID)
        }
      } catch (error) {
        console.error('Failed to sync amp engine:', error)
        if (!cancelled) {
          onSyncError?.('Failed to update the amp engine. Try play again.')
        }
      } finally {
        if (!cancelled && token === syncTokenRef.current && showLoading) {
          onSyncLoadingChange?.({ loading: false, reason: null })
        }
      }
    }

    void syncEngine()

    return () => {
      cancelled = true
    }
  }, [
    audioReady,
    effects.bypass,
    effects.reverbGain,
    effects.reverbMix,
    loadIr,
    loadModel,
    removeIr,
    selectedIrName,
    selectedModelName,
    onSyncError,
    onSyncLoadingChange,
    setBypass,
    setPlaying,
  ])

  const prevDemoInputRef = useRef(selectedDemoInputName)

  useEffect(() => {
    if (!audioReady) {
      return
    }

    if (prevDemoInputRef.current === selectedDemoInputName) {
      return
    }

    const wasPlaying = playbackRef.current
    const token = ++syncTokenRef.current

    prevDemoInputRef.current = selectedDemoInputName

    const input = getDemoInputByName(selectedDemoInputName)
    if (!input || audioState.audioUrl === input.url) {
      return
    }

    let cancelled = false

    onSyncLoadingChange?.({ loading: true, reason: 'track' })
    onSyncError?.(null)

    void loadAudio(input.url)
      .then(() => {
        if (!cancelled && wasPlaying) {
          setPlaying(true, NAM_PLAYER_ID)
        }
      })
      .catch((error) => {
        console.error('Failed to load demo input:', error)
        if (!cancelled) {
          onSyncError?.(`Could not load “${input.name}”. Try another track.`)
        }
      })
      .finally(() => {
        if (!cancelled && token === syncTokenRef.current) {
          onSyncLoadingChange?.({ loading: false, reason: null })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    audioReady,
    audioState.audioUrl,
    loadAudio,
    onSyncError,
    onSyncLoadingChange,
    selectedDemoInputName,
    setPlaying,
  ])

  useEffect(() => {
    if (!audioReady) {
      return
    }

    setBypass(effects.bypass)
  }, [audioReady, effects.bypass, setBypass])

  useEffect(() => {
    if (!audioReady) {
      return
    }

    const nodes = getAudioNodes()
    const audioContext = nodes.audioContext
    if (!audioContext || !nodes.inputGainNode || !nodes.outputGainNode) {
      return
    }

    const now = audioContext.currentTime
    nodes.inputGainNode.gain.setTargetAtTime(effects.inputGain, now, 0.02)
    nodes.outputGainNode.gain.setTargetAtTime(effects.outputGain, now, 0.02)
  }, [audioReady, effects.inputGain, effects.outputGain, getAudioNodes])

  return null
}
