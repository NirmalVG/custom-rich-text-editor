"use client"

import { useState, useCallback, useMemo, JSX } from "react"
import { RenderElementProps } from "slate-react"
import { createEditor, type Descendant } from "slate"
import {
  Editor,
  Node,
  Element as SlateElement,
  NodeMatch,
  Transforms,
  BaseEditor,
  BaseText,
} from "slate"
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderLeafProps,
} from "slate-react"
import { withHistory } from "slate-history"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type CustomElement = {
  type: string
  children: Descendant[]
}

type CustomText = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
} & Descendant

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Start typing here..." }],
  },
]

const CustomEditor = {
  isMarkActive(
    editor: { marks?: Record<string, boolean> | null },
    format: string
  ): boolean {
    const marks = editor.marks || {}
    return !!marks[format]
  },

  toggleMark(
    editor: Editor & {
      addMark: (format: string, value: boolean) => void
      removeMark: (format: string) => void
      marks?: Record<string, boolean> | null
    },
    format: string
  ): void {
    const isActive = CustomEditor.isMarkActive(editor, format)
    if (isActive) {
      editor.removeMark(format)
    } else {
      editor.addMark(format, true)
    }
  },

  isBlockActive(editor: Editor, format: string): boolean {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: selection,
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as CustomElement).type === format,
      })
    )

    return !!match
  },

  toggleBlock(
    editor: Editor & {
      unwrapNodes: (options?: {
        at?: Location
        match?: NodeMatch<Node>
        mode?: "highest" | "lowest"
        split?: boolean
        voids?: boolean
      }) => void
      setNodes: (props: { type: string }) => void
      wrapNodes: (props: { type: string; children: any[] }) => void
      selection: any
    },
    format: string
  ): void {
    const isActive = CustomEditor.isBlockActive(editor as Editor, format)
    const isList = format === "bulleted-list" || format === "numbered-list"
    Transforms.unwrapNodes(editor as Editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ((n as CustomElement).type === "bulleted-list" ||
          (n as CustomElement).type === "numbered-list"),
      split: true,
    })

    const newType = isActive ? "paragraph" : isList ? "list-item" : format
    Transforms.setNodes(
      editor as Editor,
      { type: newType } as Partial<SlateElement>
    )

    if (!isActive && isList) {
      Transforms.wrapNodes(
        editor as Editor,
        { type: format, children: [] } as SlateElement
      )
    }
  },
}

interface ElementProps extends RenderElementProps {
  element: {
    type?: string
    children: Descendant[]
    [key: string]: any
  }
}

const Element = (props: ElementProps) => {
  const { attributes, children, element } = props

  switch (element.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-2xl font-bold my-4">
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 {...attributes} className="text-xl font-bold my-3">
          {children}
        </h2>
      )
    case "heading-three":
      return (
        <h3 {...attributes} className="text-lg font-bold my-2">
          {children}
        </h3>
      )
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc pl-5 my-2">
          {children}
        </ul>
      )
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal pl-5 my-2">
          {children}
        </ol>
      )
    case "list-item":
      return (
        <li {...attributes} className="my-1">
          {children}
        </li>
      )
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic my-4"
        >
          {children}
        </blockquote>
      )
    case "code-block":
      return (
        <pre
          {...attributes}
          className="bg-gray-100 p-4 rounded font-mono text-sm my-4 overflow-x-auto"
        >
          <code>{children}</code>
        </pre>
      )
    case "callout":
      return (
        <div
          {...attributes}
          className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r"
        >
          {children}
        </div>
      )
    default:
      return (
        <p {...attributes} className="my-2">
          {children}
        </p>
      )
  }
}

const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: React.ReactNode
  leaf: BaseText & {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    code?: boolean
  }
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.code) {
    children = (
      <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    )
  }

  return <span {...attributes}>{children}</span>
}

const MarkButton = ({
  format,
  icon: Icon,
}: {
  format: string
  icon: React.ComponentType<{ className?: string }>
}) => {
  const editor = useSlate() as Editor & {
    addMark: (format: string, value: boolean) => void
    removeMark: (format: string) => void
    marks?: Record<string, boolean> | null
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8",
        CustomEditor.isMarkActive(editor, format) ? "bg-slate-200" : ""
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        CustomEditor.toggleMark(editor, format)
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

const BlockButton = ({
  format,
  icon: Icon,
}: {
  format: string
  icon: React.ComponentType<{ className?: string }>
}) => {
  const editor = useSlate()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8",
        CustomEditor.isBlockActive(editor, format) ? "bg-slate-200" : ""
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        CustomEditor.toggleBlock(
          editor as Editor &
            BaseEditor & {
              unwrapNodes: any
              setNodes: any
              wrapNodes: any
              selection: any
            },
          format
        )
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

export default function RichTextEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const [value, setValue] = useState<Descendant[]>(initialValue)

  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback(
    (props: {
      attributes: any
      children: React.ReactNode
      leaf: {
        bold?: boolean
        italic?: boolean
        underline?: boolean
        code?: boolean
      }
    }) => (
      <Leaf
        {...props}
        leaf={{ ...props.leaf, text: (props.leaf as any).text || "" }}
      />
    ),
    []
  )

  interface HandleKeyDownEvent extends React.KeyboardEvent<HTMLDivElement> {}

  const handleKeyDown = (event: HandleKeyDownEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return

    switch (event.key) {
      case "b": {
        event.preventDefault()
        CustomEditor.toggleMark(editor, "bold")
        break
      }
      case "i": {
        event.preventDefault()
        CustomEditor.toggleMark(editor, "italic")
        break
      }
      case "u": {
        event.preventDefault()
        CustomEditor.toggleMark(editor, "underline")
        break
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <div className="border-b border-gray-200 bg-white p-2 rounded-t-lg flex flex-wrap items-center gap-1">
            <MarkButton format="bold" icon={Bold} />
            <MarkButton format="italic" icon={Italic} />
            <MarkButton format="underline" icon={Underline} />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <BlockButton format="heading-one" icon={Heading1} />
            <BlockButton format="heading-two" icon={Heading2} />
            <BlockButton format="heading-three" icon={Heading3} />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <BlockButton format="bulleted-list" icon={List} />
            <BlockButton format="numbered-list" icon={ListOrdered} />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <BlockButton format="block-quote" icon={Quote} />
            <BlockButton format="code-block" icon={Code} />
            <BlockButton format="callout" icon={AlertCircle} />

            <Separator orientation="vertical" className="h-6 mx-1" />
          </div>

          <div className="bg-white p-4 rounded-b-lg min-h-[400px]">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf as (props: RenderLeafProps) => JSX.Element}
              placeholder="Start typing..."
              spellCheck
              autoFocus
              onKeyDown={handleKeyDown}
              className="outline-none min-h-[400px]"
            />
          </div>
        </Slate>
      </div>

      <div className="mt-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-mono bg-gray-100 px-1 rounded">Cmd+B</span> -
            Bold
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-1 rounded">Cmd+I</span> -
            Italic
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-1 rounded">Cmd+U</span> -
            Underline
          </div>
        </div>
      </div>
    </div>
  )
}
