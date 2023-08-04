export const AssetCardAction = (p: JSX.IntrinsicElements['button']): JSX.Element => {
  return (
    <button {...p} className={AssetCardAction.className}>
      {p.children}
    </button>
  )
}
AssetCardAction.className =
  'hover text-active rounded-full hover:border-active w-5 h-5 flex-shrink-0 flex items-center justify-center border-front/30 text-front/30 hover:text-active'
