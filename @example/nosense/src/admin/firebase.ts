import { getFirestore, connectFirestoreEmulator, Firestore } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from '@firebase/functions'
import { getStorage, connectStorageEmulator, FirebaseStorage } from '@firebase/storage'
import { getAuth, connectAuthEmulator, Auth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'

// @ts-ignore
import emulator from '../../firebase.json'

const app = initializeApp({
  apiKey: 'AIzaSyCcgdH6lv6lOlcN6KDLXH-5RWqgK41VUtw',
  authDomain: 'fuel-nosense.firebaseapp.com',
  projectId: 'fuel-nosense',
  storageBucket: 'fuel-nosense.appspot.com',
  // messagingSenderId: '506954662201',
  // appId: '1:506954662201:web:bc9e931212fab6c33068e8',
  // measurementId: 'G-WQXP8M4613',
})

export const functions: Functions = getFunctions(app)
export const firestore: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export const auth: Auth = getAuth(app)

if (process.env.NEXT_PUBLIC_FIRE_EMULATE) {
  connectFunctionsEmulator(functions, `localhost`, emulator.emulators.functions.port)
  connectFirestoreEmulator(firestore, `localhost`, emulator.emulators.firestore.port)
  connectStorageEmulator(storage, `localhost`, emulator.emulators.storage.port)

  connectAuthEmulator(auth, `http://localhost:${emulator.emulators.auth.port}`)
}
