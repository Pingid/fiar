import { getDownloadURL, getMetadata, ref } from '@firebase/storage'
import useSWR from 'swr'

import { useFirebaseStorage } from './config.js'

export const useImageMeta = (fullPath?: string) => {
  const storage = useFirebaseStorage()
  return useSWR([fullPath, 'meta'], () =>
    Promise.all([getMetadata(ref(storage, fullPath)), getDownloadURL(ref(storage, fullPath))]).then(([meta, url]) => ({
      ...meta,
      url,
    })),
  )
}

export const loadImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
    img.onerror = (e) => reject(typeof e === 'string' ? e : 'Bad image')
    img.onabort = () => resolve(src)
  })
