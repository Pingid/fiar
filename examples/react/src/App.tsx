import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { OpenAiPlugin } from '@fiar/openai'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Assets } from '@fiar/assets'
import { Auth } from '@fiar/auth'

import { articles, landing, test, tags } from './admin/entities'
import { app } from './admin/firebase'

export default function ReactApp() {
  return (
    <Dashboard>
      <OpenAiPlugin />
      <Auth
        firebase={app}
        providers={[new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()]}
        method="popup"
        allowNoAuth
      />
      <Content firebase={app} collections={[test, articles, tags]} documents={[landing]}></Content>
      <Assets
        firebase={app}
        folders={[
          { title: 'Photos', path: '/photos', accept: { ['image/*']: [] } },
          { title: 'Icons', path: '/icons' },
        ]}
      />
    </Dashboard>
  )
}
