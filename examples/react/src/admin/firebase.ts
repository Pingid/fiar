import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getStorage, connectStorageEmulator } from '@firebase/storage'
import { getAuth, connectAuthEmulator } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

import config from '../../firebase.json'

export const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
})

// let saved: any = null
if (process.env.FIRE_EMULATE) {
  const connect = (cnf: Awaited<typeof config>) => {
    connectFunctionsEmulator(getFunctions(app), `localhost`, cnf.emulators.functions.port)
    connectFirestoreEmulator(getFirestore(app), `localhost`, cnf.emulators.firestore.port)
    connectStorageEmulator(getStorage(app), `localhost`, cnf.emulators.storage.port)
    connectAuthEmulator(getAuth(app), `http://localhost:${cnf.emulators.auth.port}`)
  }
  connect(config)
}
