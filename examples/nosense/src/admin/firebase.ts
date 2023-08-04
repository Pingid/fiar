import { getFirestore, connectFirestoreEmulator, Firestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from '@firebase/functions'
import { getStorage, connectStorageEmulator, FirebaseStorage } from '@firebase/storage'
import { getAuth, connectAuthEmulator, Auth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

// @ts-ignore
import emulator from '../../firebase.json'

const app = initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
})

export const functions: Functions = getFunctions(app)
export const firestore: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export const auth: Auth = getAuth(app)

if (process.env.FIRE_EMULATE) {
  connectFunctionsEmulator(functions, `localhost`, emulator.emulators.functions.port)
  connectFirestoreEmulator(firestore, `localhost`, emulator.emulators.firestore.port)
  connectStorageEmulator(storage, `localhost`, emulator.emulators.storage.port)

  connectAuthEmulator(auth, `http://localhost:${emulator.emulators.auth.port}`)
}
