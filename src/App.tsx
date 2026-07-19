import { useCallback, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { Knob } from './components/Knob'
import { MidiPanel } from './components/MidiPanel'
import { NamPlayer } from './components/NamPlayer'
import { PresetManager } from './components/PresetManager'
import { SpectrumVisualizer } from './components/SpectrumVisualizer'
import { useMidi } from './hooks/useMidi'
import { createPreset, downloadPreset } from './lib/presets'
import {
  DEFAULT_EFFECTS,
  DEFAULT_MIDI_MAPPINGS,
  type EffectSettings,
  type TonePreset,
} from './types/preset'
import './App.css'

function App() {
  const [effects, setEffects] = useState<EffectSettings>(DEFAULT_EFFECTS)
  const [modelName, setModelName] = useState('Vox AC10')
  const [irName, setIrName] = useState('Celestion')
  const [presetName, setPresetName] = useState('Midnight Crunch')
  const [midiMappings] = useState(DEFAULT_MIDI_MAPPINGS)
  const [isLive, setIsLive] = useState(false)

  const handleMidiCc = useCallback((nextEffects: EffectSettings) => {
    setEffects(nextEffects)
  }, [])

  const midi = useMidi({
    enabled: true,
    mappings: midiMappings,
    effects,
    onCc: handleMidiCc,
  })

  const updateEffect = (key: keyof EffectSettings, value: number | boolean) => {
    setEffects((current) => ({ ...current, [key]: value }))
  }

  const handleSavePreset = () => {
    const preset = createPreset(
      presetName,
      modelName,
      irName,
      effects,
      midiMappings,
    )
    downloadPreset(preset)
  }

  const handleLoadPreset = (preset: TonePreset) => {
    setPresetName(preset.name)
    setModelName(preset.modelName)
    setIrName(preset.irName)
    setEffects(preset.effects)
  }

  const handleReset = () => {
    setEffects(DEFAULT_EFFECTS)
    setModelName('Vox AC10')
    setIrName('Celestion')
    setPresetName('Midnight Crunch')
  }

  return (
    <div className="app">
      <AmbientBackground />

      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Powered by Neural Amp Modeler</p>
          <h1>
            Shhhred <span>Studio</span>
          </h1>
          <p className="hero__subtitle">
            Plug in your guitar, shape your tone with neural amp modeling, map MIDI
            controllers, and save presets you can reload anywhere.
          </p>
        </div>
        <SpectrumVisualizer active={isLive} />
      </header>

      <main className="layout">
        <section className="panel amp-panel">
          <header className="panel__header">
            <h2>Amp Rack</h2>
            <span className={`status-pill ${isLive ? 'status-pill--on' : ''}`}>
              {isLive ? 'Live' : 'Ready'}
            </span>
          </header>

          <NamPlayer
            selectedModelName={modelName}
            selectedIrName={irName}
            effects={effects}
            onModelChange={setModelName}
            onIrChange={setIrName}
            onLiveStart={() => setIsLive(true)}
          />

          <div className="model-selectors">
            <label className="field">
              <span>Amp Model</span>
              <select
                value={modelName}
                onChange={(event) => setModelName(event.target.value)}
              >
                <option value="Vox AC10">Vox AC10</option>
                <option value="Fender Deluxe Reverb">Fender Deluxe Reverb</option>
              </select>
            </label>
            <label className="field">
              <span>Cabinet IR</span>
              <select
                value={irName}
                onChange={(event) => setIrName(event.target.value)}
              >
                <option value="None">None</option>
                <option value="Celestion">Celestion</option>
                <option value="EMT 140 Plate">EMT 140 Plate</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel controls-panel">
          <header className="panel__header">
            <h2>Tone Sculpt</h2>
          </header>

          <div className="knob-grid">
            <Knob
              label="Input Gain"
              value={effects.inputGain}
              color="#ff2d95"
              onChange={(value) => updateEffect('inputGain', value)}
            />
            <Knob
              label="Master"
              value={effects.outputGain}
              color="#7b2fff"
              onChange={(value) => updateEffect('outputGain', value)}
            />
            <Knob
              label="Tone"
              value={effects.tone}
              color="#00f5d4"
              onChange={(value) => updateEffect('tone', value)}
            />
            <Knob
              label="Reverb Mix"
              value={effects.reverbMix}
              color="#ffd166"
              onChange={(value) => updateEffect('reverbMix', value)}
            />
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={effects.bypass}
              onChange={(event) => updateEffect('bypass', event.target.checked)}
            />
            <span>Bypass amp modeling</span>
          </label>
        </section>

        <MidiPanel
          supported={midi.supported}
          ready={midi.ready}
          error={midi.error}
          inputs={midi.inputs}
          selectedInputId={midi.selectedInputId}
          mappings={midiMappings}
          lastNote={midi.lastNote}
          lastCc={midi.lastCc}
          onSelectInput={midi.selectInput}
          onEnable={() => void midi.enable()}
        />

        <PresetManager
          presetName={presetName}
          onPresetNameChange={setPresetName}
          onSave={handleSavePreset}
          onLoad={handleLoadPreset}
          onReset={handleReset}
        />
      </main>

      <footer className="footer">
        <p>
          Built with{' '}
          <a
            href="https://github.com/sdatkinson/neural-amp-modeler"
            target="_blank"
            rel="noreferrer"
          >
            Neural Amp Modeler
          </a>{' '}
          · WebAssembly DSP · Web MIDI · Web Audio
        </p>
      </footer>
    </div>
  )
}

export default App
