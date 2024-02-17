/// <reference types="../env" />

import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getStorage, connectStorageEmulator } from '@firebase/storage'
import { getAuth, connectAuthEmulator } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

export const firebase = initializeApp({
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
})

let saved: any = null
if (import.meta.env.PUBLIC_FIRE_EMULATE) {
  const get = import('../../../../firebase.json').then((x) => ((saved = x), connect(x)))
  const connect = (config: Awaited<typeof get>) => {
    connectFunctionsEmulator(getFunctions(firebase), `localhost`, config.emulators.functions.port)
    connectFirestoreEmulator(getFirestore(firebase), `localhost`, config.emulators.firestore.port)
    connectStorageEmulator(getStorage(firebase), `localhost`, config.emulators.storage.port)
    connectAuthEmulator(getAuth(firebase), `http://localhost:${config.emulators.auth.port}`)
  }
  if (saved) connect(saved)
}
