import { describe, expect, it, vi } from 'vitest'
import {
  pauseDemoPlayback,
  resumeDemoPlayback,
  syncDemoEngine,
} from './demoPlayerSyncEngine'

function createAudioHarness() {
  const state = {
    contextState: 'running' as AudioContextState,
    audioPaused: true,
  }

  const audioContext = {
    get state() {
      return state.contextState
    },
    currentTime: 0,
    resume: vi.fn(async () => {
      state.contextState = 'running'
    }),
  }

  const audioElement = {
    get paused() {
      return state.audioPaused
    },
    play: vi.fn(async () => {
      state.audioPaused = false
    }),
  }

  const inputGainNode = {
    gain: {
      setTargetAtTime: vi.fn(),
      value: 0.75,
    },
  }

  const outputGainNode = {
    gain: {
      setTargetAtTime: vi.fn(),
      value: 0,
    },
  }

  const setPlaying = vi.fn()

  return {
    state,
    audioContext,
    audioElement,
    inputGainNode,
    outputGainNode,
    setPlaying,
    getAudioNodes: () => ({
      audioContext: audioContext as unknown as AudioContext,
      audioElement: audioElement as unknown as HTMLAudioElement,
      inputGainNode: inputGainNode as unknown as GainNode,
      outputGainNode: outputGainNode as unknown as GainNode,
    }),
  }
}

describe('pauseDemoPlayback', () => {
  it('stops playback through the player context', () => {
    const setPlaying = vi.fn()

    pauseDemoPlayback(setPlaying)

    expect(setPlaying).toHaveBeenCalledWith(false)
  })
})

describe('resumeDemoPlayback', () => {
  it('resumes the audio context, playback, and effect gains', async () => {
    const harness = createAudioHarness()
    harness.state.contextState = 'suspended'

    await resumeDemoPlayback({
      setPlaying: harness.setPlaying,
      getAudioNodes: harness.getAudioNodes,
      playerId: 'player-1',
      inputGain: 0.75,
      outputGain: 0.7,
    })

    expect(harness.audioContext.resume).toHaveBeenCalled()
    expect(harness.setPlaying).toHaveBeenCalledWith(true, 'player-1')
    expect(harness.inputGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(
      0.75,
      0,
      0.02,
    )
    expect(harness.outputGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(
      0.7,
      0,
      0.02,
    )
    expect(harness.audioElement.play).toHaveBeenCalled()
  })
})

describe('syncDemoEngine', () => {
  it('pauses before reloading the engine and resumes afterward', async () => {
    const harness = createAudioHarness()
    const syncEngineSettings = vi.fn(async () => {})

    await syncDemoEngine({
      settings: {
        modelUrl: '/models/deluxe.nam',
        irUrl: '/irs/celestion.wav',
        reverbMix: 0.35,
        reverbGain: 1,
        bypassed: false,
        inputGain: 0.75,
        outputGain: 0.7,
      },
      wasPlaying: true,
      syncEngineSettings,
      setPlaying: harness.setPlaying,
      getAudioNodes: harness.getAudioNodes,
      playerId: 'player-1',
    })

    expect(harness.setPlaying).toHaveBeenNthCalledWith(1, false)
    expect(syncEngineSettings).toHaveBeenCalledWith({
      modelUrl: '/models/deluxe.nam',
      ir: {
        url: '/irs/celestion.wav',
        mix: 0.35,
        gain: 1,
      },
      bypassed: false,
    })
    expect(harness.setPlaying).toHaveBeenLastCalledWith(true, 'player-1')
    expect(harness.audioElement.play).toHaveBeenCalled()
  })

  it('skips resume when playback was not active', async () => {
    const harness = createAudioHarness()
    const syncEngineSettings = vi.fn(async () => {})

    await syncDemoEngine({
      settings: {
        modelUrl: '/models/deluxe.nam',
        irUrl: null,
        reverbMix: 0.35,
        reverbGain: 1,
        bypassed: false,
        inputGain: 0.75,
        outputGain: 0.7,
      },
      wasPlaying: false,
      syncEngineSettings,
      setPlaying: harness.setPlaying,
      getAudioNodes: harness.getAudioNodes,
      playerId: 'player-1',
    })

    expect(harness.setPlaying).not.toHaveBeenCalled()
    expect(harness.audioElement.play).not.toHaveBeenCalled()
  })
})
