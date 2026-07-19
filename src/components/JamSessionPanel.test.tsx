import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JamSessionPanel } from './JamSessionPanel'
import { DEFAULT_JAM_SETTINGS } from '../types/jamSession'

const baseProps = {
  phase: 'idle' as const,
  countdownRemaining: null,
  settings: DEFAULT_JAM_SETTINGS,
  recordingSeconds: 0,
  isRecording: false,
  isDrumsPlaying: false,
  onSettingsChange: vi.fn(),
  onArm: vi.fn(),
  onDisarm: vi.fn(),
  onStopDrums: vi.fn(),
  onStartRecording: vi.fn(),
  onStopRecording: vi.fn(),
}

describe('JamSessionPanel', () => {
  it('renders jam controls', () => {
    render(<JamSessionPanel {...baseProps} />)

    expect(screen.getByTestId('jam-panel')).toBeInTheDocument()
    expect(screen.getByTestId('countdown-seconds')).toHaveValue(5)
    expect(screen.getByTestId('drum-track-select')).toBeInTheDocument()
    expect(screen.getByTestId('recording-format-select')).toBeInTheDocument()
  })

  it('arms the session', async () => {
    const user = userEvent.setup()
    const onArm = vi.fn()
    render(<JamSessionPanel {...baseProps} onArm={onArm} />)

    await user.click(screen.getByTestId('arm-session'))
    expect(onArm).toHaveBeenCalledOnce()
  })

  it('updates countdown seconds', async () => {
    const user = userEvent.setup()
    const onSettingsChange = vi.fn()
    render(<JamSessionPanel {...baseProps} onSettingsChange={onSettingsChange} />)

    await user.clear(screen.getByTestId('countdown-seconds'))
    await user.type(screen.getByTestId('countdown-seconds'), '8')

    expect(onSettingsChange).toHaveBeenCalled()
  })
})
