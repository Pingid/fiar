import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Authorize } from '@fiar/auth'
import { Assets } from '@fiar/assets'

import { articles, landing, test, tags } from './admin/entities'
import { firestore, storage, auth } from './admin/firebase'

export default function ReactApp() {
  return (
    <Dashboard>
      <Authorize
        auth={auth}
        providers={[new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()]}
        method="popup"
        allowNoAuth
      >
        <Content firestore={firestore} collections={[test, articles, tags]} documents={[landing]}></Content>
        <Assets
          storage={storage}
          folders={[
            { title: 'Photos', path: '/photos', accept: { ['image/*']: [] } },
            { title: 'Icons', path: '/icons' },
          ]}
        />
      </Authorize>
    </Dashboard>
  )
}
