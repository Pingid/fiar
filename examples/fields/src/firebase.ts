import { getFirestore } from '@firebase/firestore'
import { initializeApp } from '@firebase/app'
import { getStorage } from '@firebase/storage'

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
