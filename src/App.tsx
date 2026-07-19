import { useCallback, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { AmpModelPicker } from './components/AmpModelPicker'
import { Knob } from './components/Knob'
import { MidiPanel } from './components/MidiPanel'
import { NamPlayer } from './components/NamPlayer'
import { PresetManager } from './components/PresetManager'
import { SpectrumVisualizer } from './components/SpectrumVisualizer'
import { CABINET_IR_NAMES, DEMO_INPUT_NAMES } from './data/factoryPresets'
import type { AmpModel } from './data/catalog'
import { useMidi } from './hooks/useMidi'
import { createPreset, downloadPreset } from './lib/presets'
import { DEFAULT_STUDIO } from './lib/studioDefaults'
import {
  DEFAULT_MIDI_MAPPINGS,
  type EffectSettings,
  type TonePreset,
} from './types/preset'
import './App.css'

function App() {
  const [effects, setEffects] = useState<EffectSettings>(DEFAULT_STUDIO.effects)
  const [modelName, setModelName] = useState(DEFAULT_STUDIO.modelName)
  const [irName, setIrName] = useState(DEFAULT_STUDIO.irName)
  const [demoInputName, setDemoInputName] = useState(DEFAULT_STUDIO.demoInputName)
  const [presetName, setPresetName] = useState(DEFAULT_STUDIO.presetName)
  const [midiMappings] = useState(DEFAULT_MIDI_MAPPINGS)
  const [isPlaying, setIsPlaying] = useState(false)

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

  const applyAmpModel = (model: AmpModel) => {
    setModelName(model.name)
  }

  const handleSavePreset = () => {
    const preset = createPreset(
      presetName,
      modelName,
      irName,
      effects,
      midiMappings,
      demoInputName,
    )
    downloadPreset(preset)
  }

  const handleLoadPreset = (preset: TonePreset) => {
    setPresetName(preset.name)
    setModelName(preset.modelName)
    setIrName(preset.irName)
    setEffects(preset.effects)
    if (preset.demoInputName) {
      setDemoInputName(preset.demoInputName)
    }
  }

  const handleReset = () => {
    setPresetName(DEFAULT_STUDIO.presetName)
    setModelName(DEFAULT_STUDIO.modelName)
    setIrName(DEFAULT_STUDIO.irName)
    setDemoInputName(DEFAULT_STUDIO.demoInputName)
    setEffects(DEFAULT_STUDIO.effects)
  }

  return (
    <div className="app" data-testid="studio-app">
      <AmbientBackground />

      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Powered by Neural Amp Modeler</p>
          <h1>
            Shhhred <span>Studio</span>
          </h1>
          <p className="hero__subtitle">
            Pick any amp, dial in effects, audition DI tracks, map MIDI
            controllers, and save tones you can reload anywhere.
          </p>
        </div>
        <SpectrumVisualizer active={isPlaying} />
      </header>

      <main className="layout">
        <AmpModelPicker activeModelName={modelName} onSelect={applyAmpModel} />

        <section className="panel amp-panel" data-testid="amp-rack">
          <header className="panel__header">
            <h2>Demo Player</h2>
            <span className={`status-pill ${isPlaying ? 'status-pill--on' : ''}`}>
              {isPlaying ? 'Playing' : 'Ready'}
            </span>
          </header>
          <p className="sr-only" data-testid="active-amp-model">
            {modelName}
          </p>

          <p className="demo-audition-hint" data-testid="demo-audition-hint">
            <strong>Demo audition</strong> — choose a DI track below, switch to the{' '}
            <em>Demo</em> tab, and hit play. Swap amps or cabinets while the track
            is running.
          </p>

          <NamPlayer
            selectedModelName={modelName}
            selectedIrName={irName}
            selectedDemoInputName={demoInputName}
            effects={effects}
            onModelChange={setModelName}
            onIrChange={setIrName}
            onDemoInputChange={setDemoInputName}
            onDemoStart={() => setIsPlaying(true)}
            onLiveStart={() => setIsPlaying(true)}
          />

          <div className="model-selectors model-selectors--two">
            <label className="field">
              <span>Cabinet IR</span>
              <select
                data-testid="cabinet-ir-select"
                value={irName}
                onChange={(event) => setIrName(event.target.value)}
              >
                {CABINET_IR_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Demo Guitar</span>
              <select
                data-testid="demo-input-select"
                value={demoInputName}
                onChange={(event) => setDemoInputName(event.target.value)}
              >
                {DEMO_INPUT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="panel effects-panel" data-testid="effects-panel">
          <header className="panel__header">
            <h2>Effects</h2>
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
              data-testid="bypass-toggle"
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
          · Amp models from the NAM community · WebAssembly DSP · Web MIDI
        </p>
      </footer>
    </div>
  )
}

export default App
