import { useEffect } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'

interface NamAudioBridgeProps {
  onRegister: (
    tap: {
      audioContext: AudioContext
      connectToRecorder: (destination: AudioNode) => () => void
    } | null,
  ) => void
}

export function NamAudioBridge({ onRegister }: NamAudioBridgeProps) {
  const { getAudioNodes, isAudioReady } = useT3kPlayerContext()

  useEffect(() => {
    const ready = isAudioReady()
    const nodes = getAudioNodes()
    const audioContext = nodes.audioContext
    const outputNode = nodes.outputGainNode ?? nodes.outputWorkaroundDestination

    if (!ready || !audioContext || !outputNode) {
      onRegister(null)
      return
    }

    onRegister({
      audioContext,
      connectToRecorder: (destination: AudioNode) => {
        outputNode.connect(destination)
        return () => {
          outputNode.disconnect(destination)
        }
      },
    })

    return () => {
      onRegister(null)
    }
  }, [getAudioNodes, isAudioReady, onRegister])

  return null
}
