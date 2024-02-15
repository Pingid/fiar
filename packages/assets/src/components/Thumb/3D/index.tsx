import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { CubeIcon } from '@heroicons/react/24/outline'

const Scene = lazy(() => import('./Scene.js'))

export const Thumb3D = (props: { url: string }) => {
  const [active, setActive] = useState(false)

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const handler = (e: MouseEvent) => {
      if (container.current?.contains(e.target as any)) return

      setActive(false)
    }
    window.addEventListener('click', handler, true)
    return () => window.removeEventListener('click', handler, true)
  }, [active])

  return (
    <div
      ref={container}
      onClick={() => setActive(true)}
      className="hover:text-active relative flex h-full w-full items-center justify-center"
      role="button"
    >
      {active ? (
        <Suspense>
          <Scene url={props.url} />
        </Suspense>
      ) : (
        <CubeIcon className="h-12 w-12" />
      )}
    </div>
  )
}
