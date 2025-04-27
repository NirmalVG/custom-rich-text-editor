"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ChevronDown,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DocumentEditor() {
  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("Arial")

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-1">
          {["•", "•", "•"].map((dot, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center text-[8px]"
            >
              {dot}
            </div>
          ))}
        </div>

        <div className="flex ml-6 space-x-6 text-sm text-gray-600">
          {["File", "Edit", "View", "Insert", "Format", "Tools", "Table"].map(
            (item) => (
              <button key={item} className="hover:text-gray-900">
                {item}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex items-center px-4 py-1 border-b border-gray-200 flex-wrap">
        <div className="flex items-center mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1 border border-gray-200"
              >
                {fontSize} <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["8", "10", "12", "14", "16", "18", "24", "36"].map((size) => (
                <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1 border border-gray-200 min-w-[100px]"
              >
                {fontFamily} <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[
                "Arial",
                "Times New Roman",
                "Courier New",
                "Georgia",
                "Verdana",
              ].map((font) => (
                <DropdownMenuItem
                  key={font}
                  onClick={() => setFontFamily(font)}
                >
                  {font}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1 border border-gray-200"
              >
                11 <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["8", "9", "10", "11", "12", "14", "18", "24", "36"].map(
                (size) => (
                  <DropdownMenuItem key={size}>{size}</DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <div className="w-4 h-4 flex items-center justify-center">
              <span className="text-black">A</span>
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-black">
            <div className="w-4 h-4 flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
          </Button>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sample Document</h1>

        <h2 className="text-xl mb-2">Heading</h2>
        <p className="mb-1">
          <strong>Bold text</strong>
        </p>
        <p className="mb-1">
          <em>Italic text</em>
        </p>
        <p className="mb-1">
          <u>Underlined text</u>
        </p>
        <p className="mb-1">
          <span className="line-through">Strikethrough text</span>
        </p>
        <p className="mb-1">
          X<sub>2</sub> and X<sup>2</sup>
        </p>

        <ul className="list-disc pl-5 mb-2">
          <li>Blockqude</li>
          <li>Numbereditem</li>
        </ul>

        <p>
          Text in <span className="text-red-500">red</span>{" "}
          <span className="text-red-500">red</span>{" "}
          <span className="bg-yellow-200">highlighted</span> text
        </p>
      </div>
    </div>
  )
}
