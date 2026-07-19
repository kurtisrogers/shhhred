import { useSpectrum } from '../hooks/useSpectrum'

interface SpectrumVisualizerProps {
  active: boolean
}

export function SpectrumVisualizer({ active }: SpectrumVisualizerProps) {
  const canvasRef = useSpectrum({ active })

  return (
    <div className="spectrum">
      <canvas ref={canvasRef} className="spectrum__canvas" />
      <div className="spectrum__glow" />
    </div>
  )
}
