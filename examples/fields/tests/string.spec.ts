import { test, expect, Page } from '@playwright/test'

const goto = async (page: Page, name: string) => {
  await page.goto('http://localhost:5173')
  await page.getByRole('link', { name: 'Content' }).click()
  await page.getByRole('link', { name: new RegExp(`^${name}`) }).click()
}

test('displays initial value', async ({ page }) => {
  await goto(page, 'String')
  await expect(await page.getByLabel('Initial').inputValue()).toBe('initial')
})

test('validates missing value on submit', async ({ page }) => {
  await goto(page, 'String')
  // Needs to be dirty to allow for submit
  await page.getByLabel('Initial').fill('dirty value')
  await page.getByRole('button', { name: 'Publish' }).click()

  // Optional value
  await expect(page.locator('label[for="data.optional"]:has-text("Required")')).not.toBeVisible()

  await expect(page.locator(`label[for="data.string"]:has-text("Required")`)).toBeVisible()
  await expect(page.locator(`label[for="data.multiline"]:has-text("Required")`)).toBeVisible()
  await expect(page.locator(`label[for="data.pattern"]:has-text("Required")`)).toBeVisible()
  await expect(page.locator(`label[for="data.min"]:has-text("Required")`)).toBeVisible()
  await expect(page.locator(`label[for="data.max"]:has-text("Required")`)).toBeVisible()

  //
  await page.locator(`label[for="data.string"]`).fill('foo')
  await page.locator(`label[for="data.multiline"]`).fill('foo\nbar')
  await page.locator(`label[for="data.multiline"]`).fill('foo\nbar')
  await page.getByRole('button', { name: 'Publish' }).click()
  await expect(page.locator(`label[for="data.string"]:has-text("Required")`)).not.toBeVisible()
  await expect(page.locator(`label[for="data.multiline"]:has-text("Required")`)).not.toBeVisible()
})

// test('constraints', async ({ page }) => {
//   // await expect(page.locator(`label[for="data.pattern"]:has-text("Required")`)).toBeVisible()
//   // await expect(page.locator(`label[for="data.min"]:has-text("Required")`)).toBeVisible()
//   // await expect(page.locator(`label[for="data.max"]:has-text("Required")`)).toBeVisible()
// })
