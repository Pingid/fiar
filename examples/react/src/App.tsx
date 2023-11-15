import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench/v2'
import { Content } from '@fiar/content/v2'
import { Authorize } from '@fiar/auth/v2'
import { Assets } from '@fiar/assets/v2'

import { firestore, storage, auth } from './admin/firebase'
import { articles, landing } from './admin/entities'

export default function ReactApp() {
  return (
    <Dashboard routing="hash">
      <Authorize
        auth={auth}
        providers={[new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()]}
        allowNoAuth
      >
        <Content firestore={firestore}>
          <Content.Collection collection={articles}></Content.Collection>
          <Content.Document document={landing} />
        </Content>
        <Assets storage={storage}>
          <Assets.Folder title="Photos" path="photos" accept={{ ['image/*']: [] }} />
          <Assets.Folder title="Icons" path="icons" />
        </Assets>
      </Authorize>
    </Dashboard>
  )
}
