export const loadImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
    img.onerror = (e) => reject(typeof e === 'string' ? e : 'Bad image')
    img.onabort = () => resolve(src)
  })
