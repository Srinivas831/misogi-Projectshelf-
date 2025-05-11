"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import { BoldIcon, ItalicIcon, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("rounded p-2 hover:bg-gray-100", editor.isActive("bold") ? "bg-gray-100 text-blue-600" : "")}
        title="Bold"
      >
        <BoldIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("rounded p-2 hover:bg-gray-100", editor.isActive("italic") ? "bg-gray-100 text-blue-600" : "")}
        title="Italic"
      >
        <ItalicIcon className="h-5 w-5" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-300" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100",
          editor.isActive("heading", { level: 1 }) ? "bg-gray-100 text-blue-600" : "",
        )}
        title="Heading 1"
      >
        <Heading1 className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100",
          editor.isActive("heading", { level: 2 }) ? "bg-gray-100 text-blue-600" : "",
        )}
        title="Heading 2"
      >
        <Heading2 className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100",
          editor.isActive("heading", { level: 3 }) ? "bg-gray-100 text-blue-600" : "",
        )}
        title="Heading 3"
      >
        <Heading3 className="h-5 w-5" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-300" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100",
          editor.isActive("bulletList") ? "bg-gray-100 text-blue-600" : "",
        )}
        title="Bullet List"
      >
        <List className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100",
          editor.isActive("orderedList") ? "bg-gray-100 text-blue-600" : "",
        )}
        title="Numbered List"
      >
        <ListOrdered className="h-5 w-5" />
      </button>
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      BulletList,
      OrderedList,
      ListItem,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        bold: false,
        italic: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none min-h-[150px] max-w-none p-4",
      },
    },
  })

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[150px]" />
      {!value && !editor?.isFocused && (
        <div className="absolute top-[70px] left-4 text-gray-400 pointer-events-none">{placeholder}</div>
      )}
    </div>
  )
}
