import type { FactoryPreset } from '../data/factoryPresets'

interface FactoryPresetPickerProps {
  presets: FactoryPreset[]
  activePresetId: string
  onSelect: (preset: FactoryPreset) => void
}

export function FactoryPresetPicker({
  presets,
  activePresetId,
  onSelect,
}: FactoryPresetPickerProps) {
  return (
    <section className="panel factory-presets" data-testid="factory-presets">
      <header className="panel__header">
        <h2>Classic Presets</h2>
        <span className="status-pill status-pill--on">{presets.length} tones</span>
      </header>

      <div className="factory-presets__grid">
        {presets.map((preset) => {
          const isActive = preset.id === activePresetId
          return (
            <button
              key={preset.id}
              type="button"
              className={`factory-preset-card${isActive ? ' factory-preset-card--active' : ''}`}
              data-testid={`factory-preset-${preset.id}`}
              onClick={() => onSelect(preset)}
            >
              <span className="factory-preset-card__name">{preset.name}</span>
              <span className="factory-preset-card__tagline">{preset.tagline}</span>
              <span className="factory-preset-card__amp">{preset.modelName}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
