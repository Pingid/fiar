import { connectFirestoreEmulator, Firestore, initializeFirestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from '@firebase/functions'
import { getStorage, connectStorageEmulator, FirebaseStorage } from '@firebase/storage'
import { getAuth, connectAuthEmulator, Auth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

export const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
})

export const functions: Functions = getFunctions(app)
export const firestore: Firestore = initializeFirestore(app, {})
export const storage: FirebaseStorage = getStorage(app)
export const auth: Auth = getAuth(app)

import config from '../../../../firebase.json'

// let saved: any = null
if (process.env.FIRE_EMULATE) {
  // console.log(require('../../../../firebase.json'))
  // const config = import('../../../../firebase.json').then((x) => x.default)
  // config.then((x) => {
  //   saved = x
  //   connect(x)
  // })
  const connect = (cnf: Awaited<typeof config>) => {
    connectFunctionsEmulator(functions, `localhost`, cnf.emulators.functions.port)
    connectFirestoreEmulator(firestore, `localhost`, cnf.emulators.firestore.port)
    connectStorageEmulator(storage, `localhost`, cnf.emulators.storage.port)
    connectAuthEmulator(auth, `http://localhost:${cnf.emulators.auth.port}`)
  }
  connect(config)
}
