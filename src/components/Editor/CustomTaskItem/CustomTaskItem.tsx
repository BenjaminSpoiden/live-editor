import { Checkbox } from "@/primitives/Checkbox";
import TaskItem from "@tiptap/extension-task-item";
import { NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import styles from "./CustomTaskItem.module.css";

const TiptapCheckbox: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
    return (
      <NodeViewWrapper className={styles.tiptapTaskItem}>
        <label htmlFor="tiptap-checkbox" contentEditable={false} />
        <Checkbox
          id="tiptap-checkbox"
          checked={node.attrs.checked}
          className={styles.tiptipTaskItemCheckbox}
          onCheckedChange={(checked) => updateAttributes({ checked })}
        />
        <NodeViewContent className={styles.tiptipTaskItemContent} />
      </NodeViewWrapper>
    );
}

export const CustomTaskItem = TaskItem.extend({
    addNodeView: () => {
        return ReactNodeViewRenderer(TiptapCheckbox)
    }
});
