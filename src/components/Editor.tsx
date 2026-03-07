"use client";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

type Props = {
  content?: string;
};

export default function Editor({ content }: Props) {
  const [contentInput, setContentInput] = useState(content ?? "");
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <HeadingButton
        editor={editor}
        level={1}
        text="Heading 1"
        hideWhenUnavailable={true}
        showShortcut={true}
        // onToggled={(e) => console.log("엥", e)}
      />
      <HeadingButton
        editor={editor}
        level={2}
        text="Heading 2"
        hideWhenUnavailable={true}
        showShortcut={true}
        // onToggled={() => console.log(`Heading ${level} toggled!`)}
      />

      <EditorContent
        editor={editor}
        role="presentation"
        content={content}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </EditorContext.Provider>
  );
}
