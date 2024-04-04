import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Storage } from '@fiar/assets'
import { Auth } from '@fiar/auth'

import { articles, landing, test, tags } from './admin/models.js'
import { app } from './admin/firebase.js'

export default function ReactApp() {
  return (
    <Dashboard>
      <Auth
        app={app}
        strategy={'popup'}
        providers={[new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()]}
        allowNoAuth
      />
      <Content app={app} models={[test, articles, tags, landing]}></Content>
      <Storage
        app={app}
        folders={[
          { title: 'Photos', path: '/photos', accept: { ['image/*']: [] } },
          { title: 'Icons', path: '/icons' },
        ]}
      />
    </Dashboard>
  )
}
