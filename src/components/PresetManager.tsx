import { useRef } from 'react'
import { parsePreset } from '../lib/presets'
import type { TonePreset } from '../types/preset'

interface PresetManagerProps {
  presetName: string
  onPresetNameChange: (name: string) => void
  onSave: () => void
  onLoad: (preset: TonePreset) => void
  onReset: () => void
}

export function PresetManager({
  presetName,
  onPresetNameChange,
  onSave,
  onLoad,
  onReset,
}: PresetManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      onLoad(parsePreset(text))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load preset')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="panel preset-panel" data-testid="preset-panel">
      <header className="panel__header">
        <h2>Presets</h2>
      </header>

      <label className="field">
        <span>Preset Name</span>
        <input
          type="text"
          data-testid="preset-name-input"
          value={presetName}
          onChange={(event) => onPresetNameChange(event.target.value)}
          placeholder="Untitled Tone"
        />
      </label>

      <div className="preset-actions">
        <button type="button" className="btn btn--primary" data-testid="download-preset" onClick={onSave}>
          Download Preset
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          data-testid="load-preset"
          onClick={() => fileInputRef.current?.click()}
        >
          Load Preset
        </button>
        <button type="button" className="btn btn--ghost" data-testid="reset-studio" onClick={onReset}>
          Reset
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        data-testid="preset-file-input"
        accept=".json,.shhhred.json,application/json"
        hidden
        onChange={handleFileChange}
      />

      <p className="panel__hint">
        Presets save your amp model, cabinet IR, effect settings, and MIDI CC
        mappings as a <code>.shhhred.json</code> file you can reload anytime.
      </p>
    </section>
  )
}
