/**
 *
 * @param param: {
 *  ref - document ref
 *  data - document data
 *  del - boolean - delete past index
 *  useSoundex - index with soundex
 *  docObj - the document object in case of ssr,
 *  soundexFunc - change out soundex function for other languages,
 *  copyFields - field values to copy from original document
 *  searchCol - the collection to store search index
 *  allCol - the search sub collection to store index docs
 *  termField - the document field to store index
 *  numWords - the number of words to index in a phrase
 * }
 * @returns
 */
export const createIndexedData = ({
  data,
  indexFields,
  useSoundex = true,
  docObj = document,
  soundexFunc = soundex,
  copyFields = [],
  termField = '_term',
  numWords = 6,
}: {
  data: any
  indexFields: string[]
  useSoundex?: boolean
  docObj?: Document
  copyFields?: string[]
  soundexFunc?: (s: string) => string
  termField?: string
  numWords?: number
}) => {
  let _data: any = {}
  const m: any = {}

  // go through each field to index
  for (const field of indexFields) {
    // new indexes
    let fieldValue = data[field]

    // if array, turn into string
    if (Array.isArray(fieldValue)) {
      fieldValue = fieldValue.join(' ')
    }
    // let index: string[] = []
    let index = createIndex(docObj, fieldValue, numWords)

    // if filter function, run function on each word
    if (useSoundex) {
      const temp = []
      for (const i of index) {
        temp.push(
          i
            .split(' ')
            .map((v: string) => soundexFunc(v))
            .join(' '),
        )
      }
      index = temp
      for (const phrase of index) {
        if (phrase) {
          let v = ''
          const t = phrase.split(' ')
          while (t.length > 0) {
            const r = t.shift()
            v += v ? ' ' + r : r
            // increment for relevance
            m[v] = m[v] ? m[v] + 1 : 1
          }
        }
      }
    } else {
      for (const phrase of index) {
        if (phrase) {
          let v = ''
          for (let i = 0; i < phrase.length; i++) {
            v = phrase.slice(0, i + 1).trim()
            // increment for relevance
            m[v] = m[v] ? m[v] + 1 : 1
          }
        }
      }
    }
  }
  if (copyFields.length) {
    const d: any = {}
    for (const k of copyFields) {
      d[k] = data[k]
    }
    _data = { ...d, ..._data }
  }
  _data[termField] = m

  return _data
}

export function createIndex(doc: Document, html: string, n: number): string[] {
  // create document after text stripped from html
  // get rid of pre code blocks
  const beforeReplace = (text: any) => {
    return text.replace(/&nbsp;/g, ' ').replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, '')
  }
  const createDocs = (text: string) => {
    const finalArray: string[] = []
    const wordArray = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/ +/g, ' ')
      .trim()
      .split(' ')
    do {
      finalArray.push(wordArray.slice(0, n).join(' '))
      wordArray.shift()
    } while (wordArray.length !== 0)
    return finalArray
  }
  // strip text from html
  const extractContent = (html: string) => {
    if (typeof window === undefined) {
      // can't run on server currently
      return html
    }
    const tmp = doc.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }
  // get rid of code first
  return createDocs(extractContent(beforeReplace(html)))
}

export const getSoundIndex = (term: string) =>
  term
    .split(' ')
    .map((v) => soundex(v))
    .join(' ')

export function soundex(s: string): string {
  const a = s.toLowerCase().split('')
  const f = a.shift() as string
  let r = ''
  const codes = {
    a: '',
    e: '',
    i: '',
    o: '',
    u: '',
    b: 1,
    f: 1,
    p: 1,
    v: 1,
    c: 2,
    g: 2,
    j: 2,
    k: 2,
    q: 2,
    s: 2,
    x: 2,
    z: 2,
    d: 3,
    t: 3,
    l: 4,
    m: 5,
    n: 5,
    r: 6,
  } as any
  r =
    f +
    a
      .map((v: string) => codes[v])
      .filter((v: any, i: number, b: any[]) => (i === 0 ? v !== codes[f] : v !== b[i - 1]))
      .join('')
  return (r + '000').slice(0, 4).toUpperCase()
}
