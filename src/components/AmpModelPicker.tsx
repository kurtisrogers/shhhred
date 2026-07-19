import { AMP_MODELS, type AmpModel } from '../data/catalog'

const CATEGORY_LABELS: Record<AmpModel['category'], string> = {
  clean: 'Clean',
  crunch: 'Crunch',
  'high-gain': 'High Gain',
  metal: 'Metal',
}

const CATEGORY_ORDER: AmpModel['category'][] = [
  'clean',
  'crunch',
  'high-gain',
  'metal',
]

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

      <div className="amp-models__groups">
        {CATEGORY_ORDER.map((category) => {
          const models = AMP_MODELS.filter((model) => model.category === category)
          if (models.length === 0) {
            return null
          }

          return (
            <div key={category} className="amp-models__group">
              <h3 className="amp-models__category">{CATEGORY_LABELS[category]}</h3>
              <div className="amp-models__grid">
                {models.map((model) => {
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
            </div>
          )
        })}
      </div>
    </section>
  )
}
