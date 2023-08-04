import { test, expect, Page } from '@playwright/test'
import { login, createUser, clearUsers } from './utils/auth'

test('view and update user list', async ({ page }) => {
  await clearUsers()
  await createUser('dm.beaven@gmail.com', 'test-admin')
  await createUser('john@example.com', 'test-editor', 'editor')
  await page.goto('/admin')
  await login(page, 'dm.beaven@gmail.com', 'test-admin')

  await authUsersVisible(page)
  await page.getByRole('link', { name: 'Content' }).click()
})

const authUsersVisible = async (page: Page) => {
  await page.getByRole('link', { name: 'Users' }).click()
  await new Promise((res) => setTimeout(res, 1000))

  // List is visible
  const list = await page.getByTestId('doc-item').all()
  await expect(list[0].getByText('dm.beaven@gmail.com')).toBeVisible()
  await expect(list[0].getByText('admin')).toBeVisible()
  await expect(list[1].getByText('john@example.com')).toBeVisible()
  await expect(list[1].getByText('editor')).toBeVisible()

  // Update a user role
  await list[1].getByRole('button').click()
  await page.getByRole('menuitem', { name: 'Admin' }).click()
  await new Promise((res) => setTimeout(res, 1000))
  await expect(list[1].getByText('admin')).toBeVisible()
}
