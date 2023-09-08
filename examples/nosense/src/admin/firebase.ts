import { getFirestore, connectFirestoreEmulator, Firestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from '@firebase/functions'
import { getStorage, connectStorageEmulator, FirebaseStorage } from '@firebase/storage'
import { getAuth, connectAuthEmulator, Auth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
})

export const functions: Functions = getFunctions(app)
export const firestore: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export const auth: Auth = getAuth(app)

let saved: any = null
if (process.env.FIRE_EMULATE) {
  const get = import('../../../../firebase.json').then((x) => ((saved = x), connect(x)))
  const connect = (config: Awaited<typeof get>) => {
    connectFunctionsEmulator(functions, `localhost`, config.emulators.functions.port)
    connectFirestoreEmulator(firestore, `localhost`, config.emulators.firestore.port)
    connectStorageEmulator(storage, `localhost`, config.emulators.storage.port)
    connectAuthEmulator(auth, `http://localhost:${config.emulators.auth.port}`)
  }
  if (saved) connect(saved)
}
