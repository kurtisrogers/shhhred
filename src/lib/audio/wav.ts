export function encodeWav(audioBuffer: AudioBuffer): Blob {
  const channelCount = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const frameCount = audioBuffer.length
  const bytesPerSample = 2
  const blockAlign = channelCount * bytesPerSample
  const dataSize = frameCount * blockAlign
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channelCount, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  const channels = Array.from({ length: channelCount }, (_, index) =>
    audioBuffer.getChannelData(index),
  )

  let offset = 44
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channels[channel][frame]))
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x80_00 : sample * 0x7f_ff,
        true,
      )
      offset += 2
    }
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

export async function convertBlobToWav(source: Blob): Promise<Blob> {
  if (source.type.includes('wav')) {
    return source
  }

  const audioContext = new AudioContext()
  try {
    const arrayBuffer = await source.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return encodeWav(audioBuffer)
  } finally {
    await audioContext.close()
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function getSupportedRecorderMimeType(
  preferred: string,
): string | undefined {
  if (typeof MediaRecorder === 'undefined') {
    return undefined
  }

  const fallbacks = [
    preferred,
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ]

  return fallbacks.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
}
