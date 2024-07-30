'use client'
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import React from "react";
import * as Y from 'yjs'
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, filterSuggestionItems } from '@blocknote/core'
import { BlockTypeSelectItem, blockTypeSelectItems, DefaultReactGridSuggestionItem, FormattingToolbar, FormattingToolbarController, getDefaultReactSlashMenuItems, GridSuggestionMenuController, SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import styles from "./Editor.module.css"
import { Avatars } from "../Avatars/Avatars";
import { RiAlertFill } from "react-icons/ri";
import { Alert } from "./Plugins/Alert/Alert.plugin";
import { Mention, onGetMentionMenuItems } from "./Plugins/Mention/Mention.plugin";
import { onInsertPDFDocument, PDFReader } from "./Plugins/PDFReader/PDFReader.plugin";


type BlockNoteProps = {
    doc: Y.Doc
    provider: any
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    pdf: PDFReader
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention
  }
});



export const BlockNote: React.FC<BlockNoteProps> = ({ doc, provider }) => {
    const userInfo = useSelf((me) => me.info)
    const others = useOthers()
    const editor: BlockNoteEditor = useCreateBlockNote({
      schema,
      collaboration: {
        provider,
        fragment: doc.getXmlFragment("document-store"),
        user: {
          name: userInfo.username,
          color: userInfo.color,
        },
      },
      // uploadFile: async (file) => {
      //   console.log('FILE UPLOAD', file)
      //   return "https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf";
      // }
    } as any);
    return (
      <div className={styles.container}>
        <div className={styles.editorHeader}>
          <Avatars />
        </div>
        <div className={styles.editorPanel}>
          <BlockNoteView
            editor={editor}
            formattingToolbar={false}
            slashMenu={false}
            className={styles.editorContainer}
          >
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar
                  blockTypeSelectItems={[
                    ...blockTypeSelectItems(editor.dictionary),
                    {
                      name: "Alert",
                      type: "alert",
                      icon: RiAlertFill,
                      isSelected: (block) => block.type === "alert",
                    } satisfies BlockTypeSelectItem,
                  ]}
                />
              )}
            />
            <GridSuggestionMenuController
              triggerCharacter={"@"}
              getItems={async (query) => (
                filterSuggestionItems(
                  onGetMentionMenuItems(editor, others).map((item) => ({
                    ...item,
                    title: item.id,
                  })),
                  query
                ) as DefaultReactGridSuggestionItem[]
              )}
              columns={2}
              minQueryLength={2}
            />
            <SuggestionMenuController
                triggerCharacter={"/"}
                getItems={async (query) => 
                    filterSuggestionItems(
                        [...getDefaultReactSlashMenuItems(editor), onInsertPDFDocument(editor)],
                        query
                    )
                }
            />
          </BlockNoteView>
        </div>
      </div>
    );
}