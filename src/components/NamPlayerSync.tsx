import { useEffect } from 'react'
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

  useEffect(() => {
    if (audioState.initState !== 'ready') {
      return
    }

    const model = getAmpByName(selectedModelName)
    const ir = getIrByName(selectedIrName)
    if (!model || !ir) {
      return
    }

    void syncEngineSettings({
      modelUrl: model.url,
      ir: {
        url: ir.url || null,
        mix: effects.reverbMix,
        gain: effects.reverbGain,
      },
      bypassed: effects.bypass,
    })
  }, [
    audioState.initState,
    effects.bypass,
    effects.reverbGain,
    effects.reverbMix,
    selectedIrName,
    selectedModelName,
    syncEngineSettings,
  ])

  useEffect(() => {
    if (audioState.initState !== 'ready') {
      return
    }

    const input = getDemoInputByName(selectedDemoInputName)
    if (!input || audioState.audioUrl === input.url) {
      return
    }

    void loadAudio(input.url)
  }, [
    audioState.audioUrl,
    audioState.initState,
    loadAudio,
    selectedDemoInputName,
  ])

  useEffect(() => {
    if (audioState.initState !== 'ready') {
      return
    }

    setBypass(effects.bypass)
  }, [audioState.initState, effects.bypass, setBypass])

  useEffect(() => {
    if (audioState.initState !== 'ready') {
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
  }, [
    audioState.initState,
    effects.inputGain,
    effects.outputGain,
    getAudioNodes,
  ])

  return null
}
