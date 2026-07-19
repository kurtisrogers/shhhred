import { expect, type Download } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

let lastDownload: Download | undefined
let presetFile: { name: string; mimeType: string; buffer: Buffer } | undefined

const presetFixture = {
  version: 1,
  name: 'Arena Lead',
  modelName: 'Fender Deluxe Reverb',
  irName: 'EMT 140 Plate',
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

Then('I should see the tone sculpt controls', async ({ page }) => {
  await expect(page.getByTestId('tone-sculpt')).toBeVisible()
})

Then('I should see the MIDI panel', async ({ page }) => {
  await expect(page.getByTestId('midi-panel')).toBeVisible()
})

Then('I should see the preset panel', async ({ page }) => {
  await expect(page.getByTestId('preset-panel')).toBeVisible()
})

When('I select the amp model {string}', async ({ page }, model: string) => {
  await page.getByTestId('amp-model-select').selectOption(model)
})

When('I select the cabinet IR {string}', async ({ page }, ir: string) => {
  await page.getByTestId('cabinet-ir-select').selectOption(ir)
})

Then('the amp model should be {string}', async ({ page }, model: string) => {
  await expect(page.getByTestId('amp-model-select')).toHaveValue(model)
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
