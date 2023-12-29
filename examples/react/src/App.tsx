import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Authorize } from '@fiar/auth'
import { Assets } from '@fiar/assets'

import { firestore, storage, auth } from './admin/firebase'
import { articles, landing, test } from './admin/entities'

export default function ReactApp() {
  return (
    <Dashboard>
      <Authorize
        auth={auth}
        providers={[new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()]}
        method="popup"
        allowNoAuth
      >
        <Content firestore={firestore} collections={[test, articles]} documents={[landing]}></Content>
        <Assets storage={storage}>
          <Assets.Folder title="Photos" path="/photos" accept={{ ['image/*']: [] }} />
          <Assets.Folder title="Icons" path="/icons" />
        </Assets>
      </Authorize>
    </Dashboard>
  )
}
