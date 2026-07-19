import { AMP_MODELS, type AmpModel } from '../data/catalog'

interface AmpModelPickerProps {
  activeModelName: string
  onSelect: (model: AmpModel) => void
}

export function AmpModelPicker({
  activeModelName,
  onSelect,
}: AmpModelPickerProps) {
  return (
    <section className="panel amp-models" data-testid="amp-models">
      <header className="panel__header">
        <h2>Amp Models</h2>
        <span className="status-pill status-pill--on">
          {AMP_MODELS.length} amps
        </span>
      </header>

      <p className="panel__hint amp-models__hint">
        Pick any amp and audition it with the demo player below. Swap amps while
        a track is playing — playback keeps going.
      </p>

      <div className="amp-models__grid">
        {AMP_MODELS.map((model) => {
          const isActive = model.name === activeModelName
          return (
            <button
              key={model.id}
              type="button"
              className={`amp-model-card${isActive ? ' amp-model-card--active' : ''}`}
              data-testid={`amp-model-${model.id}`}
              onClick={() => onSelect(model)}
            >
              <span className="amp-model-card__name">{model.name}</span>
              <span className="amp-model-card__description">
                {model.description}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
