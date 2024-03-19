import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import holiTheme from 'react-syntax-highlighter/dist/cjs/styles/prism'

const Code = (props: { code: string }) => {
  return (
    <div className="shadow-colored mx-2 max-w-full overflow-auto rounded-lg bg-white text-sm">
      <div className="border-b px-4 py-2 text-sm font-bold">entities.tsx</div>
      <div className="py-2">
        <SyntaxHighlighter
          language="typescript"
          style={holiTheme}
          showLineNumbers={true}
          customStyle={{ background: 'none', padding: 0 }}
        >
          {props.code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default Code
