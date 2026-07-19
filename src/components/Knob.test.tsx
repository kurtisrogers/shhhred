import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Knob } from '../components/Knob'

describe('Knob', () => {
  it('renders label and value', () => {
    render(<Knob label="Input Gain" value={0.5} onChange={() => undefined} />)

    expect(screen.getByText('Input Gain')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('calls onChange when adjusted', () => {
    const onChange = vi.fn()

    render(<Knob label="Tone" value={0.2} onChange={onChange} />)

    const slider = screen.getByLabelText('Tone')
    fireEvent.change(slider, { target: { value: '0.8' } })

    expect(onChange).toHaveBeenCalledWith(0.8)
  })
})
