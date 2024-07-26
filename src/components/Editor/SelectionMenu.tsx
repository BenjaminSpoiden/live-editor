import { BubbleMenu, Editor } from "@tiptap/react";
import React from "react";
import styles from "./Editor.module.css";

export const SelectionMenu: React.FC<{ editor: Editor }> = ({ editor }) => {

    return (
      <BubbleMenu editor={editor} tippyOptions={{ zIndex: 99 }}>
        {shouldShowBubbleMenu(editor) ? (
          <div className={styles.bubbleMenuWrapper}>
            {/* <ToolbarInline editor={editor} />
            <ToolbarInlineAdvanced editor={editor} />
            <ToolbarThread editor={editor} /> */}
          </div>
        ) : null}
      </BubbleMenu>
    );
}


export function shouldShowBubbleMenu(editor: Editor) {
  const canBold = editor.can().chain().focus().toggleBold().run();
  const canItalic = editor.can().chain().focus().toggleItalic().run();
  const canStrike = editor.can().chain().focus().toggleStrike().run();
  const canCode = editor.can().chain().focus().toggleCode().run();
  return canBold || canItalic || canStrike || canCode;
}