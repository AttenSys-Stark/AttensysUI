import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "@headlessui/react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  maxLength = 2000,
  className = "",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      CodeBlock,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Strike,
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html.length <= maxLength) {
        onChange(html);
      }
    },
  });

  // Update editor content when value prop changes (for localStorage restoration)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount?.characters() || 0;

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Bold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
            </svg>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Italic"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
            </svg>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Strike"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-1.64 1.36-2.97 3.03-2.97 1.67 0 3.03 1.33 3.03 2.97 0 1.64-1.36 2.97-3.03 2.97-.64 0-1.19-.13-1.67-.39l-.97.97c.48.26 1.03.39 1.67.39 2.64 0 4.78-2.14 4.78-4.78 0-2.64-2.14-4.78-4.78-4.78-2.64 0-4.78 2.14-4.78 4.78 0 .64.13 1.19.39 1.67l.97-.97z" />
            </svg>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Underline"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
            </svg>
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Heading 1"
          >
            H1
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Heading 2"
          >
            H2
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Heading 3"
          >
            H3
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 17h2v.5H2v1h3v-4H2v1h2v.5H2v1zm3-3h14v-2H5v2zm0-4h14V7H5v2z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-lg">
        <EditorContent
          editor={editor}
          className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        />
      </div>

      {/* Character Count */}
      <div className="mt-2 text-right">
        <span
          className={`text-xs ${
            characterCount >= maxLength * 0.9 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {characterCount} / {maxLength} characters
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
