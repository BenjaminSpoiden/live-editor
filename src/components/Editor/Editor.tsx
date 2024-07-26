"use client";

import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from "@tiptap/extension-text-align"
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { EditorContent, useEditor } from '@tiptap/react'
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { LiveblocksCommentsHighlight } from './commentHighlight'
import React, { useEffect, useState } from "react";
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import StarterKit from "@tiptap/starter-kit";
import styles from './Editor.module.css'
import { CustomTaskItem } from "./CustomTaskItem/CustomTaskItem";
import { Toolbar } from './Toolbar/Toolbar';
import { SelectionMenu } from './SelectionMenu';
import { ThreadList } from './ThreadList/ThreadList';
import { WordCount } from './WordCount/WordCount';

type EditorProps = {
  doc: Y.Doc,
  provider: any
}

const TiptapEditor: React.FC<EditorProps> = ({ doc, provider }) => {

  const { username, color, avatar: pic } = useSelf((me) => me.info)

  const canWrite = useSelf((me) => me.canWrite)

  const editor = useEditor({
    editable: canWrite,
    editorProps: {
      attributes: {
        class: styles.editor
      }
    },
    extensions: [
      LiveblocksCommentsHighlight.configure({
        HTMLAttributes: {
          class: 'comment-highlight'
        }
      }),
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'tiptap-blockquote'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'tiptap-code'
          }
        },
        codeBlock: {
          languageClassPrefix: 'language-',
          HTMLAttributes: {
            class: 'tiptap-code-blocks',
            spellcheck: true
          }
        },
        heading: {
          levels: [1, 2, 3, 4],
          HTMLAttributes: {
            class: 'tiptap-heading'
          }
        },
        history: false,
        horizontalRule: {
          HTMLAttributes: {
            class: 'tiptap-hr'
          }
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph'
          }
        }
      }),
      CharacterCount,
      Highlight.configure({
        HTMLAttributes: {
          class: 'tiptap-highlight'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image'
        }
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'tiptap-link'
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
        emptyEditorClass: 'tiptap-empty'
      }),
      CustomTaskItem,
      TaskList.configure({
        HTMLAttributes: {
          class: 'tiptap-class-list'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Typography,
      Youtube.configure({
        nocookie: true,
        modestBranding: true,
        HTMLAttributes: {
          class: 'tiptap-youtube'
        }
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: username,
          color, 
          picture: pic
        }
      })
    ],
  });


  return (
    <div className={styles.container}>
      {canWrite ? (
        <div className={styles.editorHeader}>
          {editor ? <Toolbar editor={editor} /> : null}
        </div>
      ) : null}
      <div className={styles.editorPanel}>
        {editor ? <SelectionMenu editor={editor} /> : null}
      </div>
      <div className={styles.editorContainerOffset}>
        <div className={styles.editorContainer}>
          <EditorContent editor={editor} />
          <div className={styles.threadListContainer} data-threads="desktop">
            {editor ? <ThreadList editor={editor} /> : null}
          </div>
        </div>
        <div className={styles.mobileThreadListContainer} data-threads="mobile">
          {editor ? <ThreadList editor={editor} /> : null}
        </div>
      </div>
      {editor ? <WordCount editor={editor} /> : null}
    </div>
  );
}

export const Editor = () => {

  const room = useRoom()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<any>()

  useEffect(() => {
    const document = new Y.Doc();
    const yProdiver = new LiveblocksYjsProvider(room, document)
    setDoc(document)
    setProvider(yProdiver)

    return () => {
      document.destroy()
      yProdiver.destroy()
    }
  }, [room])

  if (!doc || !provider) {
    return null;
  }

  return (
    <TiptapEditor doc={doc} provider={provider} />
  );
}
