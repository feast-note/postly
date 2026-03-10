"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { usePostData } from "@/hooks/usePostData";
import { useSelect } from "@/context/SelectContext";

type Props = {
  id: string;
  content?: string;
};

export default function Editor({ id, content }: Props) {
  const { selected, onSelect } = useSelect();

  const { modiPostItem } = usePostData();
  const isEdit = selected === id;

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    onBlur: ({ editor }) => {
      const text = editor.getHTML();
      if (content === text) return;
      modiPostItem.mutate({ id, post: { content: text } });
    },
    onFocus: () => onSelect(id),
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="p-4 flex-1 flex flex-col">
        <EditorContent
          editor={editor}
          className="flex-1 flex flex-col"
          role="presentation"
          content={content}
          id="editor"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            editor?.commands.focus();
          }}
          autoFocus
        />

        <div className={`flex ${isEdit ? "visible" : "invisible"}`}>
          <HeadingDropdownMenu
            editor={editor}
            levels={[1, 2, 3, 4, 5, 6]}
            hideWhenUnavailable={true}
            portal={false}
          />
          <MarkButton
            editor={editor}
            type="bold"
            text="Bold"
            hideWhenUnavailable={true}
            showShortcut={true}
            onToggled={() => console.log("Mark toggled!")}
          />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
          <MarkButton type="underline" />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
