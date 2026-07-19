import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/NamPlayer', () => ({
  NamPlayer: ({
    selectedModelName,
    selectedDemoInputName,
  }: {
    selectedModelName: string
    selectedDemoInputName: string
  }) => (
    <div
      data-testid="nam-player-mock"
      data-model={selectedModelName}
      data-demo={selectedDemoInputName}
    />
  ),
}))

vi.mock('./hooks/useJamSession', () => ({
  useJamSession: () => ({
    phase: 'idle',
    countdownRemaining: null,
    settings: {
      countdownSeconds: 5,
      drumTrackId: 'metal-thrash-140',
      drumVolume: 0.7,
      recordingFormat: 'wav',
      autoRecord: true,
    },
    recordingSeconds: 0,
    isDrumsPlaying: false,
    isRecording: false,
    updateSettings: vi.fn(),
    armSession: vi.fn(),
    disarmSession: vi.fn(),
    handleMidiNote: vi.fn(),
    stopDrums: vi.fn(),
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    registerNamAudioTap: vi.fn(),
  }),
}))

vi.mock('./hooks/useMidi', () => ({
  useMidi: () => ({
    supported: true,
    enabled: true,
    ready: false,
    error: null,
    inputs: [],
    selectedInputId: null,
    lastNote: null,
    lastCc: null,
    selectInput: vi.fn(),
    enable: vi.fn(),
  }),
}))

describe('App', () => {
  it('renders the studio shell and main panels', () => {
    render(<App />)

    expect(screen.getByTestId('studio-app')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Shhhred/i })).toBeInTheDocument()
    expect(screen.getByTestId('factory-presets')).toBeInTheDocument()
    expect(screen.getByTestId('amp-rack')).toBeInTheDocument()
    expect(screen.getByTestId('tone-sculpt')).toBeInTheDocument()
    expect(screen.getByTestId('midi-panel')).toBeInTheDocument()
    expect(screen.getByTestId('preset-panel')).toBeInTheDocument()
    expect(screen.getByTestId('jam-panel')).toBeInTheDocument()
    expect(screen.getByTestId('demo-input-select')).toBeInTheDocument()
  })

  it('loads a factory preset for the Peavey 5150', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('factory-preset-5150-block-boosted'))

    expect(screen.getByTestId('amp-model-select')).toHaveValue(
      'Peavey 5150 Block Letter (Boosted)',
    )
    expect(screen.getByTestId('demo-input-select')).toHaveValue('Metalcore - Guitar')
    expect(screen.getByTestId('preset-name-input')).toHaveValue('5150 Block Letter')
  })

  it('changes amp model selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(
      screen.getByTestId('amp-model-select'),
      'Fender Deluxe Reverb',
    )

    expect(screen.getByTestId('amp-model-select')).toHaveValue(
      'Fender Deluxe Reverb',
    )
  })

  it('resets studio defaults', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('factory-preset-5150-block-boosted'))
    await user.click(screen.getByTestId('reset-studio'))

    expect(screen.getByTestId('amp-model-select')).toHaveValue('Vox AC10')
    expect(screen.getByTestId('cabinet-ir-select')).toHaveValue('Celestion 4x12')
    expect(screen.getByTestId('preset-name-input')).toHaveValue('Midnight Crunch')
  })
})
