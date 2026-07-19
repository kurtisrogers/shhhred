import { expect, type Download } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

const AMP_MODEL_IDS: Record<string, string> = {
  'Vox AC10': 'vox-ac10',
  'Fender Deluxe Reverb': 'fender-deluxe',
  'Peavey 5150 Block Letter (Boosted)': 'peavey-5150-block-boosted',
  'Peavey 5150 Block Letter (No Boost)': 'peavey-5150-block-clean',
  'Peavey 6505+ Red Channel': 'peavey-6505-red',
  'Marshall JCM2000 Crunch': 'marshall-jcm2000-crunch',
  'Marshall JCM2000 Lead': 'marshall-jcm2000-lead',
  'Mesa Mark IV': 'mesa-mark-iv',
  'Soldano SLO': 'soldano-slo',
  'ENGL Savage': 'engl-savage',
  'Orange Rockerverb': 'orange-rockerverb',
  'Friedman DSM': 'friedman-dsm',
  'Laney GH100TI': 'laney-gh100ti',
}

function getAmpIdByName(name: string): string {
  const id = AMP_MODEL_IDS[name]
  if (!id) {
    throw new Error(`Unknown amp model: ${name}`)
  }
  return id
}

let lastDownload: Download | undefined
let presetFile: { name: string; mimeType: string; buffer: Buffer } | undefined

const presetFixture = {
  version: 1,
  name: 'Arena Lead',
  modelName: 'Fender Deluxe Reverb',
  irName: 'EMT 140 Plate',
  demoInputName: 'Hammer Lead - Guitar',
  effects: {
    inputGain: 0.9,
    outputGain: 0.7,
    tone: 0.8,
    reverbMix: 0.35,
    reverbGain: 1,
    bypass: false,
  },
  midiMappings: [
    { cc: 1, target: 'inputGain', label: 'Mod Wheel → Input Gain' },
    { cc: 7, target: 'outputGain', label: 'Volume → Master' },
    { cc: 74, target: 'tone', label: 'Brightness → Tone' },
    { cc: 91, target: 'reverbMix', label: 'Reverb → Wet Mix' },
  ],
  createdAt: '2026-07-19T00:00:00.000Z',
}

Given('I open Shhhred Studio', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('studio-app')).toBeVisible()
})

Then('I should see the amp rack', async ({ page }) => {
  await expect(page.getByTestId('amp-rack')).toBeVisible()
})

Then('I should see the effects panel', async ({ page }) => {
  await expect(page.getByTestId('effects-panel')).toBeVisible()
})

Then('I should see the tone sculpt controls', async ({ page }) => {
  await expect(page.getByTestId('effects-panel')).toBeVisible()
})

Then('I should see the MIDI panel', async ({ page }) => {
  await expect(page.getByTestId('midi-panel')).toBeVisible()
})

Then('I should see the preset panel', async ({ page }) => {
  await expect(page.getByTestId('preset-panel')).toBeVisible()
})

Then('I should see all amp models', async ({ page }) => {
  await expect(page.getByTestId('amp-models')).toBeVisible()
  await expect(page.getByTestId('amp-model-vox-ac10')).toBeVisible()
  await expect(page.getByTestId('amp-model-laney-gh100ti')).toBeVisible()
})

When('I select the amp model {string}', async ({ page }, model: string) => {
  await page.getByTestId(`amp-model-${getAmpIdByName(model)}`).click()
})

When('I select the cabinet IR {string}', async ({ page }, ir: string) => {
  await page.getByTestId('cabinet-ir-select').selectOption(ir)
})

Then('the amp model should be {string}', async ({ page }, model: string) => {
  await expect(page.getByTestId('active-amp-model')).toHaveText(model)
  await expect(page.getByTestId(`amp-model-${getAmpIdByName(model)}`)).toHaveClass(
    /amp-model-card--active/,
  )
})

Then('the cabinet IR should be {string}', async ({ page }, ir: string) => {
  await expect(page.getByTestId('cabinet-ir-select')).toHaveValue(ir)
})

When('I set the preset name to {string}', async ({ page }, name: string) => {
  await page.getByTestId('preset-name-input').fill(name)
})

When('I download the preset', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('download-preset').click()
  lastDownload = await downloadPromise
})

Then(
  'a preset file named {string} should be downloaded',
  async ({ page: _page }, filename: string) => {
    expect(lastDownload).toBeTruthy()
    expect(lastDownload?.suggestedFilename()).toBe(filename)
  },
)

When('I reset the studio', async ({ page }) => {
  await page.getByTestId('reset-studio').click()
})

When('I start demo playback', async ({ page }) => {
  await page.getByRole('button', { name: /^Demo$/ }).click()
  await page.getByLabel('Play').click()
})

Then('I should see {int} demo tracks', async ({ page }, count: number) => {
  await expect(page.getByTestId('demo-track-count')).toHaveText(`${count} tracks`)

  const options = page.getByTestId('demo-input-select').locator('option')
  await expect(options).toHaveCount(count)
})

When('I select the demo track {string}', async ({ page }, track: string) => {
  await page.getByTestId('demo-input-select').selectOption(track)
})

Then('the demo track should be {string}', async ({ page }, track: string) => {
  await expect(page.getByTestId('demo-input-select')).toHaveValue(track)
})

Then('demo playback should be active', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible({
    timeout: 20_000,
  })

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const audio = document.querySelector('audio')
          return audio ? !audio.paused && audio.currentTime > 0 : false
        }),
      { timeout: 20_000 },
    )
    .toBe(true)
})

Then('the preset name should be {string}', async ({ page }, name: string) => {
  await expect(page.getByTestId('preset-name-input')).toHaveValue(name)
})

Given(
  'I have a preset file named {string}',
  async ({ page: _page }, filename: string) => {
    presetFile = {
      name: filename,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(presetFixture, null, 2)),
    }
  },
)

When('I load the preset file', async ({ page }) => {
  if (!presetFile) {
    throw new Error('Preset file fixture was not created')
  }

  await page.getByTestId('preset-file-input').setInputFiles(presetFile)
})
