interface CountdownOverlayProps {
  remaining: number | null
}

export function CountdownOverlay({ remaining }: CountdownOverlayProps) {
  if (remaining === null) {
    return null
  }

  return (
    <div className="countdown-overlay" data-testid="countdown-overlay">
      <div className="countdown-overlay__pulse" />
      <p className="countdown-overlay__label">Get ready</p>
      <strong className="countdown-overlay__value">{remaining}</strong>
    </div>
  )
}
