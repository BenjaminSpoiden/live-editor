'use client'

import React from "react"
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from "@liveblocks/react-lexical"
import { useThreads } from "@liveblocks/react/suspense"
import { HeadingNode } from '@lexical/rich-text'
import ThemePlugin from "./Plugins/Theme.plugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ToolbarPlugin } from "./Plugins/Toolbar.plugin"
import { Loader } from "lucide-react"
import { FloatingToolbar } from "./Plugins/FloatingToolbar.plugin"
type EditorProps = {
  roomId: string
  currentUserType: UserType
}

const Placeholder = () => <div>Some placeholder text...</div>

export const Editor: React.FC<EditorProps> = ({ roomId, currentUserType }) => {

  const status = useEditorStatus()
  const { threads } = useThreads()


  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError(error, editor) {
      console.error('Error with initialization: ', error)
    },
    editable: currentUserType === 'editor',
    theme: ThemePlugin
  })

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          {currentUserType === "editor" && <div> DELETE MODAL </div>}
        </div>
        <div className="editor-wrapper flex flex-col items-center justify-start">
          {status === "not-loaded" || status === "loading" ? (
            <Loader />
          ) : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full"/>
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}

              />
              { currentUserType === 'editor' && <FloatingToolbar /> }
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            {/* TODO: COMMENTS */}
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}