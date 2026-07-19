# Shhhred Studio

A glam browser-based guitar studio powered by [Neural Amp Modeler (NAM)](https://github.com/sdatkinson/neural-amp-modeler). Plug in your guitar, shape your tone with neural amp modeling, control settings via MIDI, and save reusable presets.

**Live demo:** https://kurtisrogers.github.io/shhhred/

## Features

- **Live guitar input** — play through NAM amp models in real time via your audio interface
- **Neural amp modeling** — Vox AC10 and Fender Deluxe Reverb models via WebAssembly
- **Cabinet IRs** — Celestion cab and EMT 140 plate reverb impulse responses
- **MIDI control** — map CC messages to gain, tone, reverb, and master volume
- **Preset save/load** — download and reload `.shhhred.json` preset files
- **Visual feedback** — animated spectrum visualizer and neon studio UI

## Tech Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [neural-amp-modeler-wasm](https://github.com/tone-3000/neural-amp-modeler-wasm) — NAM DSP in the browser
- [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) via [WEBMIDI.js](https://webmidijs.org/)
- [Vitest](https://vitest.dev/) + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open https://localhost:5173 in Chrome or Edge. Grant microphone access for live guitar input and MIDI access for controllers.

### Build

```bash
npm run build
npm run preview
```

### Test

```bash
npm test
```

## Browser Requirements

- **Chrome or Edge** recommended (Web MIDI + SharedArrayBuffer)
- HTTPS or localhost (required for microphone and MIDI access)
- An audio interface for live guitar input

Cross-origin isolation is enabled via COOP/COEP headers in development and a service worker on GitHub Pages, which NAM's WebAssembly audio engine requires.

## Preset Format

Presets are saved as `.shhhred.json` files:

```json
{
  "version": 1,
  "name": "Midnight Crunch",
  "modelName": "Vox AC10",
  "irName": "Celestion",
  "effects": {
    "inputGain": 0.75,
    "outputGain": 0.7,
    "tone": 0.55,
    "reverbMix": 0.35,
    "reverbGain": 1.0,
    "bypass": false
  },
  "midiMappings": [
    { "cc": 1, "target": "inputGain", "label": "Mod Wheel → Input Gain" }
  ],
  "createdAt": "2026-07-19T00:00:00.000Z"
}
```

## Credits

- [Neural Amp Modeler](https://github.com/sdatkinson/neural-amp-modeler) by Steve Atkinson
- [neural-amp-modeler-wasm](https://github.com/tone-3000/neural-amp-modeler-wasm) by TONE3000

## License

MIT
