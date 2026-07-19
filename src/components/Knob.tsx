import type { ChangeEvent, CSSProperties } from 'react'

interface KnobProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  color?: string
  onChange: (value: number) => void
}

export function Knob({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  unit = '%',
  color = '#ff2d95',
  onChange,
}: KnobProps) {
  const percent = ((value - min) / (max - min)) * 100
  const display =
    unit === '%' ? `${Math.round(percent)}%` : value.toFixed(2)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value))
  }

  return (
    <div className="knob" style={{ '--knob-color': color } as CSSProperties}>
      <div className="knob__ring">
        <div
          className="knob__indicator"
          style={{ transform: `rotate(${percent * 2.7 - 135}deg)` }}
        />
        <input
          type="range"
          className="knob__input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          aria-label={label}
        />
      </div>
      <span className="knob__value">{display}</span>
      <span className="knob__label">{label}</span>
    </div>
  )
}
