
import React from "react";
import { ToolbarComponentProps } from "../ToolbarCompFactory";
import { Button } from "@/primitives/Button";
import { UndoIcon } from "@/primitives/Icons/UndoIcon";
import styles from '@/components/Editor/Toolbar/Toolbar.module.css'
import { RedoIcon } from "@/primitives/Icons/RedoIcon";

export const ToolbarCommands: React.FC<ToolbarComponentProps> = ({ editor }) => {
   return (
     <>
       <Button
         className={styles.toolbarButton}
         variant="ghost"
         onClick={(e) => editor.chain().undo().run()}
         disabled={!editor.can().chain().undo().run()}
         data-active={editor.isActive("bulletList") ? "is-active" : undefined}
         aria-label="Undo"
       >
         <UndoIcon />
       </Button>
       <Button
         className={styles.toolbarButton}
         variant="ghost"
         onClick={() => editor.chain().redo().run()}
         disabled={!editor.can().chain().redo().run()}
         data-active={editor.isActive("orderedList") ? "is-active" : undefined}
         aria-label="Redo"
       >
         <RedoIcon />
       </Button>
     </>
   );
}