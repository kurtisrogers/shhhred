interface AudioNodeBundle {
  audioContext: AudioContext | null
  audioElement: HTMLAudioElement | null
  inputGainNode: GainNode | null
  outputGainNode: GainNode | null
}

type SetPlaying = {
  (playing: true, playerId: string): void
  (playing: false): void
}

export interface DemoEngineSettings {
  modelUrl: string
  irUrl: string | null
  reverbMix: number
  reverbGain: number
  bypassed: boolean
  inputGain: number
  outputGain: number
}

export interface SyncEngineSettings {
  (config: {
    modelUrl: string
    ir: {
      url: string | null
      mix?: number
      gain?: number
    }
    bypassed: boolean
  }): Promise<void>
}

export function pauseDemoPlayback(setPlaying: SetPlaying): void {
  setPlaying(false)
}

export async function resumeDemoPlayback(params: {
  setPlaying: SetPlaying
  getAudioNodes: () => AudioNodeBundle
  playerId: string
  inputGain: number
  outputGain: number
}): Promise<void> {
  const { setPlaying, getAudioNodes, playerId, inputGain, outputGain } = params
  const nodes = getAudioNodes()
  const audioContext = nodes.audioContext

  if (audioContext?.state === 'suspended') {
    await audioContext.resume()
  }

  setPlaying(true, playerId)

  if (!audioContext || !nodes.inputGainNode || !nodes.outputGainNode) {
    return
  }

  const now = audioContext.currentTime
  nodes.inputGainNode.gain.setTargetAtTime(inputGain, now, 0.02)
  nodes.outputGainNode.gain.setTargetAtTime(outputGain, now, 0.02)

  const audioElement = nodes.audioElement
  if (audioElement?.paused) {
    await audioElement.play()
  }
}

export async function syncDemoEngine(params: {
  settings: DemoEngineSettings
  wasPlaying: boolean
  syncEngineSettings: SyncEngineSettings
  setPlaying: SetPlaying
  getAudioNodes: () => AudioNodeBundle
  playerId: string
}): Promise<void> {
  const {
    settings,
    wasPlaying,
    syncEngineSettings,
    setPlaying,
    getAudioNodes,
    playerId,
  } = params

  if (wasPlaying) {
    pauseDemoPlayback(setPlaying)
  }

  await syncEngineSettings({
    modelUrl: settings.modelUrl,
    ir: settings.irUrl
      ? {
          url: settings.irUrl,
          mix: settings.reverbMix,
          gain: settings.reverbGain,
        }
      : { url: null },
    bypassed: settings.bypassed,
  })

  if (wasPlaying) {
    await resumeDemoPlayback({
      setPlaying,
      getAudioNodes,
      playerId,
      inputGain: settings.inputGain,
      outputGain: settings.outputGain,
    })
  }
}
