import { PageStatusProvider } from '../status/index.js'
import { Header } from '../header/index.js'

export const Page = ({ children }: { children: React.ReactNode }) => {
  return <PageStatusProvider>{children}</PageStatusProvider>
}

Page.Header = Header
