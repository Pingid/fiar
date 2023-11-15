import { useEditor, EditorContent, Editor } from '@tiptap/react'
import { component } from '@fiar/workbench'
import { Control } from '@fiar/components'
import { cn } from 'mcn'

import { TurnLeftIcon, TurnRightIcon } from '../icons/index.js'
import { useTipTapConfig } from '../../context/tiptap/index.js'
import { useField } from '../../context/field/index.js'
import { FieldString } from '../../schema/index.js'

export const ContentFieldText = component('content:field:text', () => {
  const field = useField<FieldString>()
  const config = useTipTapConfig()

  const editor = useEditor({
    extensions: config.extensions,
    content: field.value() || '',
    editorProps: {
      attributes: {
        class: 'px-1 py-1 prose prose-sm sm:prose focus:outline-none min-h-[10rem] bg-back w-full sm:p-2 !max-w-full',
      },
    },
    onBlur: () => {
      const html = editor?.getHTML()
      if (html) field.update(html)
    },
  })

  return (
    <Control label={field.options?.label || ''} error={field.error}>
      {editor && <EditorControls editor={editor} />}
      <EditorContent editor={editor} />
    </Control>
  )
})

const EditorControls = ({ editor }: { editor: Editor }) => {
  const config = useTipTapConfig()
  return (
    <div className="flex flex-wrap justify-between gap-1 border-b text-sm">
      <div className="flex">
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          className="font-bold"
        >
          B
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          className="italic"
        >
          I
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          className="line-through"
        >
          S
        </Btn>
        <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')}>
          P
        </Btn>
        {([1, 2, 3, 4] as const).map((level) => (
          <Btn
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
          >
            H{level}
          </Btn>
        ))}
      </div>
      <div className="flex">
        <div className={cn('flex', [config.controls.length > 0, 'border-l'])}>
          {config.controls.map((Comp, i) => (
            <Comp key={i} editor={editor} />
          ))}
        </div>
        <div className="flex border-l">
          <Btn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <TurnLeftIcon className="relative -top-[2px] h-4 w-4" />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <TurnRightIcon className="relative -top-[2px] h-4 w-4" />
          </Btn>
        </div>
      </div>
    </div>
  )
}

const Btn = ({ active, children, ...props }: { active?: boolean } & JSX.IntrinsicElements['button']) => {
  return (
    <button
      {...props}
      className={cn(
        'disabled:text-front/50 hover:bg-front/5 flex items-center px-2.5 py-0.5',
        [!!active, 'text-active'],
        props.className,
      )}
    >
      {children}
    </button>
  )
}
