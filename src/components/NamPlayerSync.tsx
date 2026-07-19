import { useEffect, useRef } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'
import {
  getAmpByName,
  getDemoInputByName,
  getIrByName,
} from '../data/catalog'
import { audioSourcesMatch, NAM_PLAYER_ID } from '../lib/demoPlayerEngine'
import {
  pauseDemoPlayback,
  resumeDemoPlayback,
  syncDemoEngine,
} from '../lib/demoPlayerSyncEngine'
import type { EffectSettings } from '../types/preset'
import type { SyncLoadingReason, SyncLoadingState } from '../lib/demoPlayerStatus'

export { NAM_PLAYER_ID }

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
    syncEngineSettings,
    setBypass,
    setPlaying,
  } = useT3kPlayerContext()

  const audioReady = audioState.initState === 'ready' && audioState.audioUrl !== null
  const engineSyncTokenRef = useRef(0)
  const trackSyncTokenRef = useRef(0)
  const playbackRef = useRef(false)
  const loadedAudioUrlRef = useRef(audioState.audioUrl)

  playbackRef.current =
    audioState.isPlaying && audioState.activePlayerId === NAM_PLAYER_ID
  loadedAudioUrlRef.current = audioState.audioUrl

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
    const engineReloadNeeded = modelChanged || irChanged || reverbChanged
    const showLoading = engineReloadNeeded
    const token = ++engineSyncTokenRef.current

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
        if (engineReloadNeeded) {
          await syncDemoEngine({
            settings: {
              modelUrl: model.url,
              irUrl: ir.url || null,
              reverbMix: effects.reverbMix,
              reverbGain: effects.reverbGain,
              bypassed: effects.bypass,
              inputGain: effects.inputGain,
              outputGain: effects.outputGain,
            },
            wasPlaying,
            syncEngineSettings,
            setPlaying,
            getAudioNodes,
            playerId: NAM_PLAYER_ID,
          })
        } else if (bypassChanged) {
          setBypass(effects.bypass)
        }

        if (cancelled || token !== engineSyncTokenRef.current) {
          return
        }
      } catch (error) {
        console.error('Failed to sync amp engine:', error)
        if (!cancelled) {
          onSyncError?.('Failed to update the amp engine. Try play again.')
        }
      } finally {
        if (!cancelled && token === engineSyncTokenRef.current && showLoading) {
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
    effects.inputGain,
    effects.outputGain,
    effects.reverbGain,
    effects.reverbMix,
    getAudioNodes,
    selectedIrName,
    selectedModelName,
    onSyncError,
    onSyncLoadingChange,
    setBypass,
    setPlaying,
    syncEngineSettings,
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
    const token = ++trackSyncTokenRef.current

    prevDemoInputRef.current = selectedDemoInputName

    const input = getDemoInputByName(selectedDemoInputName)
    if (!input || audioSourcesMatch(loadedAudioUrlRef.current, input.url)) {
      return
    }

    let cancelled = false

    onSyncLoadingChange?.({ loading: true, reason: 'track' })
    onSyncError?.(null)

    const switchTrack = async () => {
      try {
        if (wasPlaying) {
          pauseDemoPlayback(setPlaying)
        }

        await loadAudio(input.url)

        if (cancelled || token !== trackSyncTokenRef.current) {
          return
        }

        const audioElement = getAudioNodes().audioElement
        if (audioElement) {
          audioElement.currentTime = 0
        }

        if (wasPlaying) {
          await resumeDemoPlayback({
            setPlaying,
            getAudioNodes,
            playerId: NAM_PLAYER_ID,
            inputGain: effects.inputGain,
            outputGain: effects.outputGain,
          })
        }
      } catch (error) {
        console.error('Failed to load demo input:', error)
        if (!cancelled) {
          onSyncError?.(`Could not load “${input.name}”. Try another track.`)
        }
      } finally {
        if (!cancelled && token === trackSyncTokenRef.current) {
          onSyncLoadingChange?.({ loading: false, reason: null })
        }
      }
    }

    void switchTrack()

    return () => {
      cancelled = true
    }
  }, [
    audioReady,
    effects.inputGain,
    effects.outputGain,
    getAudioNodes,
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

    if (audioState.isPlaying && audioState.activePlayerId === NAM_PLAYER_ID) {
      nodes.outputGainNode.gain.setTargetAtTime(effects.outputGain, now, 0.02)
    }
  }, [
    audioReady,
    audioState.activePlayerId,
    audioState.isPlaying,
    effects.inputGain,
    effects.outputGain,
    getAudioNodes,
  ])

  return null
}
