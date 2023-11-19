import { UsersIcon } from '@heroicons/react/24/outline'
import { App, Page } from '@fiar/workbench'

export * from './types.js'

export const UsersApp = () => {
  return (
    <App title="Users" href="/users" icon={<UsersIcon />}>
      <UsersPage />
    </App>
  )
}

export const UsersPage = () => {
  return (
    <Page>
      <Page.Breadcrumb icon={<UsersIcon />} title="Users" />
    </Page>
  )
}
