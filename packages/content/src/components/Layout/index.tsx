export const LayoutHeader = (props: {
  title?: React.ReactNode | undefined
  path?: React.ReactNode | undefined
  badge?: React.ReactNode | undefined
  children?: React.ReactNode
}) => {
  return (
    <>
      <div className="space-y-2 p-3 pb-6">
        <h2 className="relative text-3xl">{props.title}</h2>
        <p className="text-front/60 text-xs leading-none">{props.path}</p>
      </div>
      <div className="bg-back sticky top-[calc(var(--asside-height)-1px)] z-20 flex justify-between border-b border-t px-3 py-2">
        {props.children}
      </div>
    </>
  )
}
