import { cn } from 'mcn'

import { Preview } from '../assets-browser/Preview.js'
import { useQueryAssets } from '../../context/index.js'

export const ContentFieldAssets = (): JSX.Element => {
  const query = useQueryAssets()

  return (
    <div className={cn('relative grid gap-3 px-6 sm:grid-cols-[repeat(auto-fill,minmax(25rem,1fr))]')}>
      {(query.data?.items || []).map((x) => (
        <div onClick={() => {}} key={x.fullPath}>
          <Preview image={x} />
        </div>
      ))}
    </div>
  )
}
