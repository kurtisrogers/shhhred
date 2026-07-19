import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/NamPlayer', () => ({
  NamPlayer: () => <div data-testid="nam-player-mock" />,
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
    expect(screen.getByTestId('amp-rack')).toBeInTheDocument()
    expect(screen.getByTestId('tone-sculpt')).toBeInTheDocument()
    expect(screen.getByTestId('midi-panel')).toBeInTheDocument()
    expect(screen.getByTestId('preset-panel')).toBeInTheDocument()
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

    await user.selectOptions(
      screen.getByTestId('amp-model-select'),
      'Fender Deluxe Reverb',
    )
    await user.selectOptions(screen.getByTestId('cabinet-ir-select'), 'None')
    await user.click(screen.getByTestId('reset-studio'))

    expect(screen.getByTestId('amp-model-select')).toHaveValue('Vox AC10')
    expect(screen.getByTestId('cabinet-ir-select')).toHaveValue('Celestion')
    expect(screen.getByTestId('preset-name-input')).toHaveValue('Midnight Crunch')
  })
})
