import { Editor } from "@tiptap/react";
import React from "react";
import styles from './Toolbar.module.css'
import { onCreateToolbarComponent } from "./ToolbarFactory/createToolbarFactory";

type ToolbarProps = {
  editor: Editor
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => (
  <div className={styles.toolbar}>
    {onCreateToolbarComponent(editor)}
  </div>
);
