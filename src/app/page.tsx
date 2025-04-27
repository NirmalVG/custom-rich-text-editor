"use client"

import RichTextEditor from "@/components/rich-text-editor"

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Custom Rich Text Editor
      </h1>
      <RichTextEditor />
    </div>
  )
}
