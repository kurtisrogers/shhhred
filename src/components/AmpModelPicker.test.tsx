import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AmpModelPicker } from './AmpModelPicker'
import { AMP_MODELS } from '../data/catalog'

describe('AmpModelPicker', () => {
  it('lists every amp model in the catalog', () => {
    render(<AmpModelPicker activeModelName="Vox AC10" onSelect={() => {}} />)

    for (const model of AMP_MODELS) {
      expect(screen.getByTestId(`amp-model-${model.id}`)).toBeInTheDocument()
    }
  })

  it('selects an amp model', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<AmpModelPicker activeModelName="Vox AC10" onSelect={onSelect} />)

    await user.click(screen.getByTestId('amp-model-fender-deluxe'))

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Fender Deluxe Reverb' }),
    )
  })
})
