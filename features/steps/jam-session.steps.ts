import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('I set the jam countdown to {string}', async ({ page }, seconds: string) => {
  await page.getByTestId('countdown-seconds').fill(seconds)
})

Then('the jam countdown should be {string}', async ({ page }, seconds: string) => {
  await expect(page.getByTestId('countdown-seconds')).toHaveValue(seconds)
})

When('I arm the jam session', async ({ page }) => {
  await page.getByTestId('arm-session').click()
})

Then('the jam session should be armed', async ({ page }) => {
  await expect(page.getByTestId('disarm-session')).toBeVisible()
  await expect(page.getByText(/Armed — play MIDI to start countdown/u)).toBeVisible()
})
