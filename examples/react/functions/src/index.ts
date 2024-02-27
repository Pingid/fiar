// import { createProxyMiddleware } from 'http-proxy-middleware'
// import { applicationDefault } from 'firebase-admin/app'
import * as functions from 'firebase-functions'
// import { OpenAI } from 'openai'

// import * as Admin from 'firebase-admin'
// import express from 'express'

// const admin = Admin.initializeApp({ credential: applicationDefault() })
// const OPENAI_API_KEY = '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'
// const OPENAI_ORG_ID = 'org-IPemicoqKNZmT0WdMtvz46VI'
// const app = express()
// app.use(
//   createProxyMiddleware({
//     target: 'https://api.openai.com', // target host with the same base path
//     changeOrigin: true, // needed for virtual hosted sites
//     followRedirects: true,
//     headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'OpenAI-Organization': OPENAI_ORG_ID },
//   }),
// )
// const middleware = createProxyMiddleware({
//   target: 'https://api.openai.com', // target host with the same base path
//   changeOrigin: true, // needed for virtual hossted sites
//   followRedirects: true,
//   // headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'OpenAI-Organization': OPENAI_ORG_ID },
//   onProxyReq: (proxyReq, req) => {
//     console.log(req.originalUrl)
//     console.log(req.url)
//     console.log(req.body)
//     proxyReq.setHeader('Authorization', `Bearer ${OPENAI_API_KEY}`)
//     proxyReq.setHeader('OpenAI-Organization', OPENAI_ORG_ID)
//   },
//   onProxyRes: (proxyRes, req, res) => {
//     console.log(proxyRes.headers)
//     proxyRes.headers['Access-Control-Allow-Origin'] = '*'
//     proxyRes.headers['Access-Control-Allow-Headers'] =
//       'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
//   },
//   onError: (e, req, res) => {
//     console.error(e)
//     console.log(req.url)
//     console.log(req.originalUrl)
//     console.log(req.baseUrl)
//     console.log(req.body)

//     res.send('ERROR')
//   },
// })

export const openai = functions.https.onRequest(async (req, res) => {
  // const token = req.get('Authorization')?.split('Bearer ')[1]
  // if (token) {
  //   await admin
  //     .auth()
  //     .verifyIdToken(token)
  //     .then((x) => console.log(x))
  // }
  // const openai = new OpenAI({
  //   apiKey: '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',
  //   organization: 'org-IPemicoqKNZmT0WdMtvz46VI',
  //   // dangerouslyAllowBrowser: true,
  // })
  // console.log(req.path)
  // await openai.images
  //   .generate({
  //     model: 'dall-e-2',
  //     prompt: 'A woman sitting in reverse on the toiled using the back as a table to work on a laptop from',
  //     size: '256x256',
  //     n: 1,
  //   })
  //   .then((x) => {
  //     console.log(x.data)
  //     res.send(JSON.stringify(x.data))
  //   })
  //   .catch((e) => console.error(e))

  // return {}
  // console.log(req.url, req.body)
  // curl https://api.openai.com/v1/files/file-abc123/content \

  console.log(JSON.stringify(req.body))
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  await fetch(`https://api.openai.com${req.url}`, {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: {
      Authorization: `Bearer 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`,
      'OpenAI-Organization': 'org-IPemicoqKNZmT0WdMtvz46VI',
      'Content-Type': 'application/json',
    },
  })
    .then((x) => x.json())
    .then((x) => {
      console.log({ x })
      res.send(x)
    })
    .catch((e) => {
      console.error(e)
      res.send({ done: '123' })
    })

  // middleware(req, res, (c) => {
  //   console.log('{ c }', { c })
  // })
})
