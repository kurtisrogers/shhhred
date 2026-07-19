import { useEffect, useRef } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'
import {
  getAmpByName,
  getDemoInputByName,
  getIrByName,
} from '../data/catalog'
import type { EffectSettings } from '../types/preset'

interface NamPlayerSyncProps {
  selectedModelName: string
  selectedIrName: string
  selectedDemoInputName: string
  effects: EffectSettings
}

export function NamPlayerSync({
  selectedModelName,
  selectedIrName,
  selectedDemoInputName,
  effects,
}: NamPlayerSyncProps) {
  const {
    audioState,
    getAudioNodes,
    loadAudio,
    syncEngineSettings,
    setBypass,
  } = useT3kPlayerContext()

  const audioReady = audioState.initState === 'ready' && audioState.audioUrl !== null

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

    const timer = window.setTimeout(() => {
      void syncEngineSettings({
        modelUrl: model.url,
        ir: {
          url: ir.url || null,
          mix: effects.reverbMix,
          gain: effects.reverbGain,
        },
        bypassed: effects.bypass,
      })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [
    audioReady,
    effects.bypass,
    effects.reverbGain,
    effects.reverbMix,
    selectedIrName,
    selectedModelName,
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

    prevDemoInputRef.current = selectedDemoInputName

    const input = getDemoInputByName(selectedDemoInputName)
    if (!input || audioState.audioUrl === input.url) {
      return
    }

    void loadAudio(input.url)
  }, [audioReady, audioState.audioUrl, loadAudio, selectedDemoInputName])

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
