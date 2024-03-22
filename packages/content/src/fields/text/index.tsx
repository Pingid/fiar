import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import { useEffect } from 'react'
import { cn } from 'mcn'

import { Field, FieldControl } from '@fiar/components'

import { useFormFieldControl, useFieldForm, useFieldPreview, registerField } from '../../context/field.js'
import { TipTipTools, useTipTapExtensions } from './provider.js'
import { IFieldString } from '../../schema/index.js'

export { TipTapTool, useTipTapExtensions } from './provider.js'

export const PreviewFieldText = () => {
  const field = useFieldPreview<IFieldString>()
  return <div dangerouslySetInnerHTML={{ __html: field.value }} className="line-clamp-3 text-sm" />
}

export const FormFieldText = () => {
  const field = useFieldForm<IFieldString>()
  const extensions = useTipTapExtensions((x) => x.extensions)
  const control = useFormFieldControl<IFieldString>()

  const editor = useEditor({
    editable: !control.field.disabled,
    extensions,
    content: control.field.value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose focus:outline-none min-h-[10rem] bg-back w-full sm:px-8 sm:py-12 py-6 px-5 !max-w-full',
      },
    },
    onUpdate: (x) => control.field.onChange(x.editor.getHTML()),
    onBlur: () => control.field.onBlur(),
  })

  useEffect(() => {
    if (!editor || control.field.value === editor.getHTML()) return
    editor.commands.setContent(control.field.value)
  }, [control.field.value])

  return (
    <Field {...field}>
      <FieldControl error={!!field.error}>
        {editor && <EditorControls editor={editor} />}
        <EditorContent editor={editor} />
      </FieldControl>
    </Field>
  )
}

registerField('text', { form: FormFieldText, preview: PreviewFieldText })

const EditorControls = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex flex-wrap justify-between gap-1 border-b text-sm">
      <div className="flex">
        <TipTapToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          className="font-bold"
        >
          B
        </TipTapToolButton>
        <TipTapToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          className="italic"
        >
          I
        </TipTapToolButton>
        <TipTapToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          className="line-through"
        >
          S
        </TipTapToolButton>
        <TipTapToolButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          P
        </TipTapToolButton>
        {([1, 2, 3, 4] as const).map((level) => (
          <TipTapToolButton
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
          >
            H{level}
          </TipTapToolButton>
        ))}
      </div>
      <div className="flex">
        <TipTipTools editor={editor} />
        <div className="flex border-l">
          <TipTapToolButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <ArrowUturnLeftIcon className="relative -top-[2px] h-4 w-4" />
          </TipTapToolButton>
          <TipTapToolButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <ArrowUturnRightIcon className="relative -top-[2px] h-4 w-4" />
          </TipTapToolButton>
        </div>
      </div>
    </div>
  )
}

export const TipTapToolButton = ({
  active,
  children,
  ...props
}: { active?: boolean } & JSX.IntrinsicElements['button']) => {
  return (
    <button
      {...props}
      className={cn(
        'disabled:text-front/50 hover:bg-front/5 flex items-center px-2.5 pb-1 pt-1.5',
        [!!active, 'text-active'],
        props.className,
      )}
    >
      {children}
    </button>
  )
}
