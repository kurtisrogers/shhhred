import { describe, expect, it } from 'vitest'
import { encodeWav } from './wav'

describe('encodeWav', () => {
  it('creates a wav blob from an audio buffer', () => {
    const buffer = {
      numberOfChannels: 1,
      length: 441,
      sampleRate: 44100,
      getChannelData: () => new Float32Array(441).fill(0.25),
    } as unknown as AudioBuffer

    const blob = encodeWav(buffer)
    expect(blob.type).toBe('audio/wav')
    expect(blob.size).toBeGreaterThan(44)
  })
})
