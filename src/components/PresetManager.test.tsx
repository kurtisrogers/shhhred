import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PresetManager } from './PresetManager'
import { createPreset, serializePreset } from '../lib/presets'

describe('PresetManager', () => {
  it('renders preset controls', () => {
    render(
      <PresetManager
        presetName="Midnight Crunch"
        onPresetNameChange={() => undefined}
        onSave={() => undefined}
        onLoad={() => undefined}
        onReset={() => undefined}
      />,
    )

    expect(screen.getByTestId('preset-panel')).toBeInTheDocument()
    expect(screen.getByTestId('preset-name-input')).toHaveValue('Midnight Crunch')
    expect(screen.getByTestId('download-preset')).toBeInTheDocument()
  })

  it('updates preset name', async () => {
    const user = userEvent.setup()
    const onPresetNameChange = vi.fn()

    render(
      <PresetManager
        presetName="Midnight Crunch"
        onPresetNameChange={onPresetNameChange}
        onSave={() => undefined}
        onLoad={() => undefined}
        onReset={() => undefined}
      />,
    )

    await user.clear(screen.getByTestId('preset-name-input'))
    await user.type(screen.getByTestId('preset-name-input'), 'Arena Lead')

    expect(onPresetNameChange).toHaveBeenCalled()
  })

  it('loads a valid preset file', async () => {
    const user = userEvent.setup()
    const onLoad = vi.fn()
    const preset = createPreset('Loaded Tone', 'Vox AC10', 'Celestion')
    const file = new File([serializePreset(preset)], 'loaded.shhhred.json', {
      type: 'application/json',
    })

    render(
      <PresetManager
        presetName="Midnight Crunch"
        onPresetNameChange={() => undefined}
        onSave={() => undefined}
        onLoad={onLoad}
        onReset={() => undefined}
      />,
    )

    await user.upload(screen.getByTestId('preset-file-input'), file)

    expect(onLoad).toHaveBeenCalledWith(preset)
  })

  it('calls reset handler', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()

    render(
      <PresetManager
        presetName="Midnight Crunch"
        onPresetNameChange={() => undefined}
        onSave={() => undefined}
        onLoad={() => undefined}
        onReset={onReset}
      />,
    )

    await user.click(screen.getByTestId('reset-studio'))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
