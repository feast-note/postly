"use client";
import { usePostContent } from "@/hooks/usePostContent";
import { usePostData } from "@/hooks/usePostData";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  content?: string;
};

export default function PostContentForm({ id, content }: Props) {
  const [contentInput, setContentInput] = useState(content ?? "");

  const { setLocalStorage, delLocalStorage } = usePostContent(id);
  const { modiPostItem } = usePostData();

  const contentRef = useRef("");

  const handleContent = (e: React.ChangeEvent) => {
    const newContent = (e.target as HTMLTextAreaElement).value;
    setContentInput(newContent);
    setLocalStorage(newContent);
    contentRef.current = newContent;
  };

  useEffect(() => {
    const saveContent = () => {
      if (contentRef.current.length > 0) {
        modiPostItem.mutate({ id, content: contentRef.current });
        contentRef.current = "";
        delLocalStorage();
      }
    };
    window.addEventListener("beforeunload", saveContent);
    return () => {
      window.removeEventListener("beforeunload", saveContent);
    };
  }, [delLocalStorage, id, modiPostItem]);

  return (
    <textarea
      className="w-full flex-1 mt-2 resize-none select-auto"
      name="content"
      value={contentInput}
      placeholder="Enter content here"
      onChange={handleContent}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
}
