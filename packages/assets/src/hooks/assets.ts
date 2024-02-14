import { deleteObject, list, ref } from '@firebase/storage'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { AssetFolder, useStorage } from './config.js'
import { useUploads } from './uploads.js'

export const useAssets = (folder: AssetFolder) => {
  const [previous, setPrevious] = useState<string[]>([])
  const [next, setNext] = useState<string>()
  const [limit] = useState(3)

  const uploads = useUploads((x) => x.uploads)
  const refresh = useUploads((x) => x.refresh)
  const storage = useStorage()
  const path = folder.path

  const current = previous[previous.length - 1]

  const query = useSWR(
    `${path}-${limit}-${current || ''}`,
    () => list(ref(storage, path), { pageToken: current as string, maxResults: limit }),
    { onSuccess: (x) => setNext(x.nextPageToken) },
  )

  const onRemove = (fullPath: string) =>
    query.mutate(deleteObject(ref(storage, fullPath)) as Promise<undefined>, {
      optimisticData: {
        ...query.data,
        items: (query.data?.items ?? []).filter((y) => y.fullPath !== fullPath),
      } as any,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    })

  useEffect(() => refresh(query.data?.items ?? []), [query.data])

  const all = query.data?.items ?? []
  const existing = all.map((x) => x.name)
  const filtered = uploads.filter((x) => !existing.includes(x.name)).filter((x) => x.name.startsWith(path))
  const items = [...filtered, ...all].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

  const onPage = (n: number) => {
    if (n > previous.length && next) {
      setPrevious((x) => [...x, next])
      setNext(undefined)
    }
    if (n < previous.length) setPrevious(previous.slice(0, n))
  }

  return { onRemove, items, end: !next, isLoading: query.isLoading, onPage, error: query.error }
}
