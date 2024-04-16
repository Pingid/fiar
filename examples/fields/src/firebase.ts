import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore'
import { connectStorageEmulator, getStorage } from '@firebase/storage'
import { connectAuthEmulator, getAuth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

import config from '../firebase.json'

const auth = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
}

export const app = initializeApp(auth)
export const firestore = getFirestore(app, config.firestore.database)
export const storage = getStorage(app, `gs://${config.storage.bucket}`)

// let saved: any = null
if (import.meta.env.VITE_FIREBASE_EMULATE) {
  connectFirestoreEmulator(firestore, `localhost`, config.emulators.firestore.port)
  connectStorageEmulator(storage, `localhost`, config.emulators.storage.port)
  connectAuthEmulator(getAuth(app), `http://localhost:${config.emulators.auth.port}`)
}
