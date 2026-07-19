import { useEffect, useRef } from 'react'

interface UseSpectrumOptions {
  active: boolean
}

export function useSpectrum({ active }: UseSpectrumOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const bars = 64
    const phases = Array.from({ length: bars }, (_, index) => index * 0.3)

    const draw = (time: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      canvas.width = width
      canvas.height = height

      context.clearRect(0, 0, width, height)

      const barWidth = width / bars
      for (let index = 0; index < bars; index += 1) {
        const wave =
          Math.sin(time * 0.002 + phases[index]) * 0.35 +
          Math.sin(time * 0.004 + phases[index] * 1.7) * 0.2
        const level = active
          ? 0.25 + Math.abs(wave) * 0.75
          : 0.08 + Math.abs(wave) * 0.12
        const barHeight = level * height
        const x = index * barWidth
        const y = height - barHeight

        const gradient = context.createLinearGradient(0, y, 0, height)
        gradient.addColorStop(0, '#ff2d95')
        gradient.addColorStop(0.5, '#7b2fff')
        gradient.addColorStop(1, '#00f5d4')

        context.fillStyle = gradient
        context.fillRect(x + 1, y, barWidth - 2, barHeight)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [active])

  return canvasRef
}
