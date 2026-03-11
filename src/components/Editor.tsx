"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit, FontSize } from "@tiptap/extension-text-style";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { usePostData } from "@/hooks/usePostData";
import { useSelect } from "@/context/SelectContext";
import Heading from "@tiptap/extension-heading";

type Props = {
  id: string;
  content?: string;
};

export default function Editor({ id, content }: Props) {
  const { selected, onSelect } = useSelect();
  const isEdit = id === selected;

  const { modiPostItem } = usePostData();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      FontSize,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: content,
    immediatelyRender: false,
    onBlur: ({ editor }) => {
      const text = editor.getHTML();
      if (content === text) return;
      modiPostItem.mutate({ id, post: { content: text } });
    },
    onFocus: ({ editor }) => editor?.commands.focus(),
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="flex-1 flex flex-col cursor-text">
        <EditorContent
          editor={editor}
          className="flex flex-1 pt-4 px-2"
          role="presentation"
          content={content}
          id="editor"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            onSelect(id);
          }}
          autoFocus
        />
        {editor && (
          <div
            className={`flex p-0.5 ${isEdit ? "visible" : "invisible"} bg-neutral-50/35`}
          >
            <HeadingDropdownMenu
              editor={editor}
              levels={[1, 2, 3, 4, 5, 6]}
              hideWhenUnavailable={true}
              showTooltip
            />
            <MarkButton
              editor={editor}
              type="bold"
              text="Bold"
              hideWhenUnavailable={true}
              showShortcut={true}
            />
            <MarkButton type="italic" />
            <MarkButton type="strike" />
            <MarkButton type="code" />
            <MarkButton type="underline" />
          </div>
        )}
      </div>
    </EditorContext.Provider>
  );
}
