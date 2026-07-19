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
    expect(screen.getByTestId('amp-models')).toBeInTheDocument()
    expect(screen.getByTestId('amp-rack')).toBeInTheDocument()
    expect(screen.getByTestId('demo-audition-hint')).toBeInTheDocument()
    expect(screen.getByTestId('effects-panel')).toBeInTheDocument()
    expect(screen.getByTestId('midi-panel')).toBeInTheDocument()
    expect(screen.getByTestId('preset-panel')).toBeInTheDocument()
    expect(screen.getByTestId('demo-input-select')).toBeInTheDocument()
    expect(screen.getByTestId('demo-track-count')).toHaveTextContent('34 tracks')
  })

  it('changes amp model selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('amp-model-fender-deluxe'))

    expect(screen.getByTestId('active-amp-model')).toHaveTextContent(
      'Fender Deluxe Reverb',
    )
    expect(screen.getByTestId('amp-model-fender-deluxe')).toHaveClass(
      'amp-model-card--active',
    )
  })

  it('resets studio defaults', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('amp-model-fender-deluxe'))
    await user.click(screen.getByTestId('reset-studio'))

    expect(screen.getByTestId('active-amp-model')).toHaveTextContent('Vox AC10')
    expect(screen.getByTestId('cabinet-ir-select')).toHaveValue('Celestion 4x12')
    expect(screen.getByTestId('preset-name-input')).toHaveValue('Untitled Tone')
  })
})
