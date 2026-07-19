import type { DrumTrack } from '../../data/drumTracks'

type SampleName = 'kick' | 'snare' | 'hihat'

const SAMPLE_PATHS: Record<SampleName, string> = {
  kick: 'samples/kick.wav',
  snare: 'samples/snare.wav',
  hihat: 'samples/hihat.wav',
}

export class DrumEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private recordBus: GainNode | null = null
  private samples: Partial<Record<SampleName, AudioBuffer>> = {}
  private track: DrumTrack | null = null
  private timerId: number | null = null
  private stepIndex = 0
  private playing = false
  private volume = 0.7

  async init(baseUrl: string): Promise<AudioContext> {
    if (this.audioContext) {
      return this.audioContext
    }

    this.audioContext = new AudioContext()
    this.masterGain = this.audioContext.createGain()
    this.recordBus = this.audioContext.createGain()
    this.masterGain.connect(this.audioContext.destination)
    this.masterGain.connect(this.recordBus)
    this.masterGain.gain.value = this.volume

    const sampleNames = Object.keys(SAMPLE_PATHS) as SampleName[]
    await Promise.all(
      sampleNames.map(async (name) => {
        const response = await fetch(`${baseUrl}drums/${SAMPLE_PATHS[name]}`)
        const arrayBuffer = await response.arrayBuffer()
        this.samples[name] = await this.audioContext!.decodeAudioData(arrayBuffer)
      }),
    )

    return this.audioContext
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  connectRecordDestination(destination: AudioNode): void {
    this.recordBus?.connect(destination)
  }

  disconnectRecordDestination(destination: AudioNode): void {
    this.recordBus?.disconnect(destination)
  }

  setVolume(value: number): void {
    this.volume = value
    if (this.masterGain) {
      this.masterGain.gain.value = value
    }
  }

  async start(track: DrumTrack): Promise<void> {
    await this.init(import.meta.env.BASE_URL)
    if (!this.audioContext || this.playing) {
      return
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    this.track = track
    this.stepIndex = 0
    this.playing = true
    this.scheduleStep()
  }

  stop(): void {
    this.playing = false
    this.track = null
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId)
      this.timerId = null
    }
  }

  isPlaying(): boolean {
    return this.playing
  }

  private scheduleStep(): void {
    if (!this.playing || !this.track || !this.audioContext) {
      return
    }

    const step = this.track.steps[this.stepIndex % this.track.steps.length]
    this.playStep(step)
    this.stepIndex += 1

    const stepDurationMs = (60_000 / this.track.bpm / 4)
    this.timerId = window.setTimeout(() => this.scheduleStep(), stepDurationMs)
  }

  private playStep(step: DrumTrack['steps'][number]): void {
    if (!this.audioContext || !this.masterGain) {
      return
    }

    const now = this.audioContext.currentTime
    if (step.kick) this.triggerSample('kick', now)
    if (step.snare) this.triggerSample('snare', now)
    if (step.hat) this.triggerSample('hihat', now, 0.55)
  }

  private triggerSample(
    name: SampleName,
    when: number,
    gain = 1,
  ): void {
    const buffer = this.samples[name]
    if (!buffer || !this.audioContext || !this.masterGain) {
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    source.buffer = buffer
    gainNode.gain.value = gain
    source.connect(gainNode)
    gainNode.connect(this.masterGain)
    source.start(when)
  }

  playClick(second: number): void {
    if (!this.audioContext || !this.masterGain) {
      return
    }

    const oscillator = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const now = this.audioContext.currentTime
    const frequency = second <= 1 ? 880 : 660

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    oscillator.connect(gain)
    gain.connect(this.masterGain)
    oscillator.start(now)
    oscillator.stop(now + 0.12)
  }
}
