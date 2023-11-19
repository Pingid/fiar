import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@firebase/auth'
import { Dashboard } from '@fiar/workbench'
import { Content } from '@fiar/content'
import { Authorize, UsersApp } from '@fiar/auth'
import { Assets } from '@fiar/assets'

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
        <UsersApp />
      </Authorize>
    </Dashboard>
  )
}
