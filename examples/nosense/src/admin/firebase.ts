/// <reference types="../env" />

import { getFirestore, connectFirestoreEmulator, Firestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from '@firebase/functions'
import { getStorage, connectStorageEmulator, FirebaseStorage } from '@firebase/storage'
import { getAuth, connectAuthEmulator, Auth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

const app = initializeApp({
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
})

export const functions: Functions = getFunctions(app)
export const firestore: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export const auth: Auth = getAuth(app)

let saved: any = null
if (import.meta.env.PUBLIC_FIRE_EMULATE) {
  const get = import('../../../../firebase.json').then((x) => ((saved = x), connect(x)))
  const connect = (config: Awaited<typeof get>) => {
    connectFunctionsEmulator(functions, `localhost`, config.emulators.functions.port)
    connectFirestoreEmulator(firestore, `localhost`, config.emulators.firestore.port)
    connectStorageEmulator(storage, `localhost`, config.emulators.storage.port)
    connectAuthEmulator(auth, `http://localhost:${config.emulators.auth.port}`)
  }
  if (saved) connect(saved)
}
