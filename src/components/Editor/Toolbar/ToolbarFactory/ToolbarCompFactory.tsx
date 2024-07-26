import { Editor } from "@tiptap/react"
import React from "react"

export type ToolbarComponentProps = {
    editor: Editor
}

export type ToolbarComponent = {
    component: React.FC<ToolbarComponentProps>
    key: string
}