import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Assets } from '@fiar/assets'
import { Auth } from '@fiar/auth'

import { articles, landing, test, tags } from './admin/entities'
import { app } from './admin/firebase'

export default function ReactApp() {
  return (
    <Dashboard>
      <Auth
        app={app}
        auth={{
          strategy: 'popup',
          providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
        }}
        allowNoAuth
      />
      <Content app={app} content={[test, articles, tags, landing]}></Content>
      <Assets
        app={app}
        assets={[
          { title: 'Photos', path: '/photos', accept: { ['image/*']: [] } },
          { title: 'Icons', path: '/icons' },
        ]}
      />
    </Dashboard>
  )
}
