import { Page } from '@playwright/test'
import { app } from './firebase'

export const login = async (page: Page, email: string, password: string) => {
  await page.getByLabel('email').fill(email)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

export const createUser = async (email: string, password: string, role: string = 'admin') => {
  const user = await app.auth().createUser({ email, password, emailVerified: true })
  await app.auth().setCustomUserClaims(user.uid, { fiar: role })
}

export const clearUsers = async (time: number = Date.now()) => {
  if (time && Date.now() - 90_000 > time) return Promise.reject(`Timed out waiting for auth`)
  return app
    .auth()
    .listUsers()
    .then((x) => Promise.all(x.users.map((y) => app.auth().deleteUser(y.uid))))
    .catch((e) => {
      console.error(e)
      return Promise.reject(e)
    })
}
