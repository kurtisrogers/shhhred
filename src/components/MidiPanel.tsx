import { midiNoteToName } from '../lib/midi'
import type { MidiDeviceInfo } from '../lib/midi'
import type { MidiMapping } from '../types/preset'

interface MidiPanelProps {
  supported: boolean
  ready: boolean
  error: string | null
  inputs: MidiDeviceInfo[]
  selectedInputId: string | null
  mappings: MidiMapping[]
  lastNote: { note: number; velocity: number } | null
  lastCc: { cc: number; value: number } | null
  onSelectInput: (id: string) => void
  onEnable: () => void
}

export function MidiPanel({
  supported,
  ready,
  error,
  inputs,
  selectedInputId,
  mappings,
  lastNote,
  lastCc,
  onSelectInput,
  onEnable,
}: MidiPanelProps) {
  return (
    <section className="panel midi-panel">
      <header className="panel__header">
        <h2>MIDI Control</h2>
        <span className={`status-pill ${ready ? 'status-pill--on' : ''}`}>
          {ready ? 'Connected' : 'Standby'}
        </span>
      </header>

      {!supported && (
        <p className="panel__hint">
          Web MIDI is not available in this browser. Use Chrome or Edge for MIDI
          guitar controllers and foot pedals.
        </p>
      )}

      {supported && !ready && (
        <button type="button" className="btn btn--ghost" onClick={onEnable}>
          Enable MIDI Access
        </button>
      )}

      {error && <p className="panel__error">{error}</p>}

      {ready && (
        <>
          <label className="field">
            <span>Input Device</span>
            <select
              value={selectedInputId ?? ''}
              onChange={(event) => onSelectInput(event.target.value)}
            >
              {inputs.map((input) => (
                <option key={input.id} value={input.id}>
                  {input.name} ({input.manufacturer})
                </option>
              ))}
            </select>
          </label>

          <div className="midi-readout">
            <div>
              <span className="midi-readout__label">Last Note</span>
              <strong>
                {lastNote
                  ? `${midiNoteToName(lastNote.note)} · vel ${lastNote.velocity}`
                  : '—'}
              </strong>
            </div>
            <div>
              <span className="midi-readout__label">Last CC</span>
              <strong>
                {lastCc ? `CC ${lastCc.cc} → ${lastCc.value}` : '—'}
              </strong>
            </div>
          </div>

          <ul className="midi-mappings">
            {mappings.map((mapping) => (
              <li key={`${mapping.cc}-${mapping.target}`}>
                <span className="midi-mappings__cc">CC {mapping.cc}</span>
                <span>{mapping.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
