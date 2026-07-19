# Shhhred Studio

[![CI](https://github.com/kurtisrogers/shhhred/actions/workflows/ci.yml/badge.svg)](https://github.com/kurtisrogers/shhhred/actions/workflows/ci.yml)

A glam browser-based guitar studio powered by [Neural Amp Modeler (NAM)](https://github.com/sdatkinson/neural-amp-modeler). Plug in your guitar, shape your tone with neural amp modeling, control settings via MIDI, and save reusable presets.

**Live demo:** https://kurtisrogers.github.io/shhhred/

## Features

- **Live guitar input** — play through NAM amp models in real time via your audio interface
- **Demo player** — audition tones instantly with pre-recorded guitar DI tracks
- **Neural amp modeling** — 13 amp models including Peavey 5150, 6505+, Laney GH100TI, JCM2000, Mesa Mark IV, Soldano, ENGL, and more
- **Classic presets** — one-click factory tones for metal and rock rigs
- **Cabinet IRs** — Celestion 4x12 and EMT 140 plate reverb impulse responses
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
npm test              # unit tests
npm run test:coverage # unit tests with coverage
npm run test:e2e      # Playwright BDD scenarios
npm run validate      # lint + typecheck + unit + e2e
```

### Quality gates

Pre-commit hooks (Husky + lint-staged) run oxlint and related Vitest tests on staged TypeScript files.

GitHub Actions CI (`.github/workflows/ci.yml`) runs on every push and pull request:

| Job | What it runs |
|-----|--------------|
| **Lint, Typecheck & Unit Tests** | oxlint, `tsc -b`, Vitest with coverage artifact upload |
| **Playwright BDD** | Playwright scenarios from `features/*.feature` |
| **All checks passed** | Aggregate gate — use this as the required status check for branch protection |
| **Deploy GitHub Pages** | Builds and publishes to GitHub Pages (push to `main`, or manual run with deploy enabled) |

#### Run CI or deploy manually

The **Run workflow** button appears under **Actions → CI** only after this workflow exists on the default branch (`main`). Merge the CI PR first if you do not see it.

1. Go to **Actions → CI**
2. Click **Run workflow**
3. Select the `main` branch
4. Check **Deploy to GitHub Pages after tests pass** to publish after tests succeed
5. Click **Run workflow**

Deploy only runs from `main`. Unchecked, a manual run runs tests only.

In **Settings → Branches → Branch protection rules** for `main`, enable **Require status checks to pass before merging** and select:

- `All checks passed`

Optionally also require the individual jobs (`Lint, Typecheck & Unit Tests`, `Playwright BDD`) if you want granular visibility in the PR UI.

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

## Amp model credits

Community NAM captures are sourced from [pelennor2170/NAM_models](https://github.com/pelennor2170/NAM_models) (GPL-3.0). Demo guitar DI tracks are from the [neural-amp-modeler-wasm](https://github.com/tone-3000/neural-amp-modeler-wasm) project.

## License

MIT
