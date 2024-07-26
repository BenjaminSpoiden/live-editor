import { Editor } from "@tiptap/react";
import { ToolbarCommands } from "./Comps/ToolbarCommands";
import { ToolbarComponent } from "./ToolbarCompFactory";
import { Fragment } from "react";
import styles from "@/components/Editor/Toolbar/Toolbar.module.css";
import { ToolbarHeadings } from "./Comps/ToolbarHeadings";

//  <ToolbarHeadings editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarInline editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarInlineAdvanced editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarAlignment editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarBlock editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarMedia editor={editor} />
//     <div className={styles.toolbarSeparator} />
//     <ToolbarThread editor={editor} />

export const toolbarComponents: ToolbarComponent[] = [
    {component: ToolbarCommands, key: 'toolbarCommends'},
    {component: ToolbarHeadings, key: 'toolbarHeadings'}
]

export const onCreateToolbarComponent = (editor: Editor) => {
    return toolbarComponents.map(({ component: Component, key }) => (
      <Fragment key={key}>
        <Component editor={editor} />
        <div className={styles.toolbarSeparator} />
      </Fragment>
    ));
}