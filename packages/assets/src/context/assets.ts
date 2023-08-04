import useMutaton from 'swr/mutation'
import useQuery from 'swr'

import { StorageReference, deleteObject, getDownloadURL, listAll, ref } from '@firebase/storage'
import { useAssetConfig } from './config'

export const is_image = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$/i
export const is_video = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i
export const is_pdf = /\.(pdf)$/i

export const useQueryAssets = () => {
  const config = useAssetConfig()
  return useQuery(config.storagePrefix, () => listAll(ref(config.storage, config.storagePrefix)))
}

export const useRemoveAsset = (fullPath: string) => {
  const config = useAssetConfig()
  return useMutaton(config.storagePrefix, () => deleteObject(ref(config.storage, fullPath)), {
    optimisticData: (x: { items: StorageReference[] }) => ({
      ...x,
      items: x.items.filter((y) => y.fullPath !== fullPath),
    }),
  })
}

export const useAssetUrl = (image: Pick<StorageReference, 'bucket' | 'fullPath'>) => {
  const config = useAssetConfig()
  return useQuery(image.fullPath, () =>
    getDownloadURL(ref(config.storage, image.fullPath))
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
