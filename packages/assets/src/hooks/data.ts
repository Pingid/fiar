import useQuery from 'swr'

import { StorageReference, getDownloadURL, listAll, ref } from '@firebase/storage'
import { useConfig } from './config.js'

export const is_image = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$/i
export const is_video = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i
export const is_pdf = /\.(pdf)$/i

const useStorage = () => useConfig((x) => x.storage!)

export const useQueryAssets = (path: string) => {
  const storage = useStorage()
  return useQuery(path, () => listAll(ref(storage, path)))
}

export const useAssetUrl = (image: Pick<StorageReference, 'bucket' | 'fullPath'>) => {
  const storage = useStorage()
  return useQuery(image.fullPath, () =>
    getDownloadURL(ref(storage, image.fullPath))
      .then((url) => {
        if (is_image.test(url)) return loadImage(url).then(() => url)
        return url
      })
      .catch((e) => {
        console.error(e)
        return Promise.reject(e?.message)
      }),
  )
}

const loadImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
    img.onerror = (e) => reject(typeof e === 'string' ? e : 'Bad image')
    img.onabort = () => resolve(src)
  })
