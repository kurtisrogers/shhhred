import {
  convertBlobToWav,
  downloadBlob,
  getSupportedRecorderMimeType,
} from './wav'
import type { RecordingFormat } from '../../types/jamSession'
import { RECORDING_FORMATS } from '../../types/jamSession'

export class SessionRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private destination: MediaStreamAudioDestinationNode | null = null
  private recording = false
  private startedAt = 0

  getDestination(audioContext: AudioContext): MediaStreamAudioDestinationNode {
    if (!this.destination) {
      this.destination = audioContext.createMediaStreamDestination()
    }
    return this.destination
  }

  isRecording(): boolean {
    return this.recording
  }

  getElapsedSeconds(): number {
    if (!this.recording) {
      return 0
    }
    return Math.floor((Date.now() - this.startedAt) / 1000)
  }

  start(audioContext: AudioContext, format: RecordingFormat): void {
    if (this.recording) {
      return
    }

    const destination = this.getDestination(audioContext)
    const formatConfig = RECORDING_FORMATS.find((item) => item.id === format)
    const mimeType = getSupportedRecorderMimeType(
      formatConfig?.mimeType ?? 'audio/webm;codecs=opus',
    )

    if (!mimeType) {
      throw new Error('Recording is not supported in this browser')
    }

    this.chunks = []
    this.mediaRecorder = new MediaRecorder(destination.stream, { mimeType })
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data)
      }
    }
    this.mediaRecorder.start(250)
    this.recording = true
    this.startedAt = Date.now()
  }

  async stop(format: RecordingFormat, filenameBase: string): Promise<void> {
    if (!this.mediaRecorder || !this.recording) {
      return
    }

    const recorder = this.mediaRecorder
    const blob = await new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        resolve(new Blob(this.chunks, { type: recorder.mimeType }))
      }
      recorder.onerror = () => reject(new Error('Recording failed'))
      recorder.stop()
    })

    this.recording = false
    this.mediaRecorder = null
    this.chunks = []

    const formatConfig =
      RECORDING_FORMATS.find((item) => item.id === format) ??
      RECORDING_FORMATS[0]

    let exportBlob = blob
    let extension = formatConfig.extension

    if (format === 'wav') {
      exportBlob = await convertBlobToWav(blob)
      extension = 'wav'
    } else if (format === 'ogg' && !blob.type.includes('ogg')) {
      exportBlob = await convertBlobToWav(blob)
      extension = 'wav'
    }

    const safeName = filenameBase
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    downloadBlob(
      exportBlob,
      `${safeName || 'shhhred-jam'}.${extension}`,
    )
  }
}
