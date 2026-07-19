import { useCallback, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { FactoryPresetPicker } from './components/FactoryPresetPicker'
import { Knob } from './components/Knob'
import { MidiPanel } from './components/MidiPanel'
import { NamPlayer } from './components/NamPlayer'
import { PresetManager } from './components/PresetManager'
import { SpectrumVisualizer } from './components/SpectrumVisualizer'
import {
  AMP_MODEL_NAMES,
  CABINET_IR_NAMES,
  DEMO_INPUT_NAMES,
  DEFAULT_FACTORY_PRESET,
  FACTORY_PRESETS,
  type FactoryPreset,
} from './data/factoryPresets'
import { useMidi } from './hooks/useMidi'
import { createPreset, downloadPreset } from './lib/presets'
import {
  DEFAULT_MIDI_MAPPINGS,
  type EffectSettings,
  type TonePreset,
} from './types/preset'
import './App.css'

function applyFactoryPreset(preset: FactoryPreset) {
  return {
    presetName: preset.name,
    modelName: preset.modelName,
    irName: preset.irName,
    demoInputName: preset.demoInputName,
    effects: { ...preset.effects },
    factoryPresetId: preset.id,
  }
}

function App() {
  const initial = applyFactoryPreset(DEFAULT_FACTORY_PRESET)
  const [effects, setEffects] = useState<EffectSettings>(initial.effects)
  const [modelName, setModelName] = useState(initial.modelName)
  const [irName, setIrName] = useState(initial.irName)
  const [demoInputName, setDemoInputName] = useState(initial.demoInputName)
  const [presetName, setPresetName] = useState(initial.presetName)
  const [factoryPresetId, setFactoryPresetId] = useState(initial.factoryPresetId)
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
    setFactoryPresetId('')
  }

  const applyPreset = (preset: FactoryPreset) => {
    const next = applyFactoryPreset(preset)
    setPresetName(next.presetName)
    setModelName(next.modelName)
    setIrName(next.irName)
    setDemoInputName(next.demoInputName)
    setEffects(next.effects)
    setFactoryPresetId(next.factoryPresetId)
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
    setFactoryPresetId('')
  }

  const handleReset = () => {
    applyPreset(DEFAULT_FACTORY_PRESET)
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
            Audition classic amp tones, play live through neural modeling, map MIDI
            controllers, and save presets you can reload anywhere.
          </p>
        </div>
        <SpectrumVisualizer active={isPlaying} />
      </header>

      <main className="layout">
        <FactoryPresetPicker
          presets={FACTORY_PRESETS}
          activePresetId={factoryPresetId}
          onSelect={applyPreset}
        />

        <section className="panel amp-panel" data-testid="amp-rack">
          <header className="panel__header">
            <h2>Amp Rack</h2>
            <span className={`status-pill ${isPlaying ? 'status-pill--on' : ''}`}>
              {isPlaying ? 'Playing' : 'Ready'}
            </span>
          </header>

          <NamPlayer
            selectedModelName={modelName}
            selectedIrName={irName}
            selectedDemoInputName={demoInputName}
            effects={effects}
            onModelChange={(name) => {
              setModelName(name)
              setFactoryPresetId('')
            }}
            onIrChange={(name) => {
              setIrName(name)
              setFactoryPresetId('')
            }}
            onDemoInputChange={(name) => {
              setDemoInputName(name)
              setFactoryPresetId('')
            }}
            onDemoStart={() => setIsPlaying(true)}
            onLiveStart={() => setIsPlaying(true)}
          />

          <div className="model-selectors model-selectors--three">
            <label className="field">
              <span>Amp Model</span>
              <select
                data-testid="amp-model-select"
                value={modelName}
                onChange={(event) => {
                  setModelName(event.target.value)
                  setFactoryPresetId('')
                }}
              >
                {AMP_MODEL_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Cabinet IR</span>
              <select
                data-testid="cabinet-ir-select"
                value={irName}
                onChange={(event) => {
                  setIrName(event.target.value)
                  setFactoryPresetId('')
                }}
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
                onChange={(event) => {
                  setDemoInputName(event.target.value)
                  setFactoryPresetId('')
                }}
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

        <section className="panel controls-panel" data-testid="tone-sculpt">
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
