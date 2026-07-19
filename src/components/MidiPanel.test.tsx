import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MidiPanel } from './MidiPanel'
import { DEFAULT_MIDI_MAPPINGS } from '../types/preset'

const baseProps = {
  supported: true,
  ready: false,
  error: null,
  inputs: [],
  selectedInputId: null,
  mappings: DEFAULT_MIDI_MAPPINGS,
  lastNote: null,
  lastCc: null,
  onSelectInput: vi.fn(),
  onEnable: vi.fn(),
}

describe('MidiPanel', () => {
  it('shows enable button when MIDI is supported but not ready', () => {
    render(<MidiPanel {...baseProps} />)

    expect(screen.getByTestId('midi-panel')).toBeInTheDocument()
    expect(screen.getByTestId('enable-midi')).toBeInTheDocument()
  })

  it('shows unsupported message when Web MIDI is unavailable', () => {
    render(<MidiPanel {...baseProps} supported={false} />)

    expect(
      screen.getByText(/Web MIDI is not available in this browser/u),
    ).toBeInTheDocument()
  })

  it('renders connected device controls when ready', () => {
    render(
      <MidiPanel
        {...baseProps}
        ready
        inputs={[
          { id: 'midi-1', name: 'Fishman TriplePlay', manufacturer: 'Fishman' },
        ]}
        selectedInputId="midi-1"
        onSelectInput={vi.fn()}
      />,
    )

    expect(screen.getByText(/Fishman TriplePlay/u)).toBeInTheDocument()
    expect(screen.getByText(/CC 1/u)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('midi-1')
  })
})
