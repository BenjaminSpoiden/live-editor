"use client";

import { useCreateThread, useThreads } from "@liveblocks/react/suspense";
import { Composer, ComposerSubmitComment, Thread } from "@liveblocks/react-ui";
import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import styles from './ThreadList.module.css'
import { getCommentHighlightContent, removeCommentHighlight, useHighlightEventListener } from "../../../utils/commentUtils";
import { ThreadData } from "@liveblocks/core";
import { CommentIcon } from "@/primitives/Icons/CommentIcon";

const ThreadComposer: React.FC<{ editor: Editor }> = ({ editor }) => {
    const composer = useRef<HTMLFormElement>(null) 
    const createThread = useCreateThread()

    const onHandleComposerSubmit = useCallback(({body}: ComposerSubmitComment, event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const highlightId = editor.storage.commentHighlight.currentHighlightId
        if(!highlightId) return

        createThread({
            body,
            metadata: { highlightId }
        })

        editor.commands.setCommentHighlight({
            highlightId, 
            state: 'complete'
        })

        editor.storage.commentHighlight.currentHighlightId = null;
        editor.storage.commentHighlight.showComposer = false;
        editor.storage.commentHighlight.previousHighlightSelection = null;

         setTimeout(() => {
           const newThreadElement = document.querySelector(
             `[data-threads="mobile"] [data-highlight-id="${highlightId}"]`
           );
           newThreadElement?.scrollIntoView();
         });
    }, [editor, createThread])

    useEffect(() => {
        if(!composer.current) return

        const element = composer.current

        const closeComposer = (event: FocusEvent) => {
            if(event.relatedTarget instanceof HTMLElement && event.relatedTarget.closest(".lb-portal")) {
                return
            }

            removeCommentHighlight(editor, editor.storage.commentHighlight);
            editor.storage.commentHighlight.currentHighlightId = null;
            editor.storage.commentHighlight.showComposer = false;
        }

        element.addEventListener("focusout", closeComposer);

        return () => {
            element.removeEventListener('focusout', closeComposer)
        }
    }, [editor, composer])

    return (
        <Composer 
            ref={composer}
            className={styles.compser}
            onComposerSubmit={onHandleComposerSubmit}
            onClick={(e) => e.preventDefault()}
            autoFocus
        />
    )
} 

const  NoComments: React.FC = () => {
  return (
    <div className={styles.noComments}>
      <div className={styles.noCommentsHeader}>No comments yet</div>
      <p>
        <span className={styles.noCommentsButton}>
          <CommentIcon />
        </span>
        Create a comment by selecting text and pressing the comment button.
      </p>
    </div>
  );
}

const CustomThread: React.FC<{ thread: ThreadData<any>, editor: Editor }> = ({ thread, editor }) => {
    const [active, setActive] = useState(false)

    useHighlightEventListener((highlighId) => {
        setActive(highlighId === thread.metadata.highlightId)
    })

    const onHandleThreadDelete = useCallback((thread: ThreadData<{highlightId: string}>) => {
        removeCommentHighlight(editor, thread.metadata.highlightId)
    }, [editor])

    const quoteHtml = getCommentHighlightContent(thread.metadata.highlightId)

    return (
      <div className="hide-collaboration-cursor">
        <div
          className={styles.thread}
          data-active={active}
          data-highlight-id={thread.metadata.highlightId}
        >
            {quoteHtml ? (
                <div
                    className={styles.threadQuote}
                    dangerouslySetInnerHTML={{ __html: getCommentHighlightContent(thread.metadata.highlightId) as string }}
                >

                </div>
            ) : null}
            <Thread thread={thread} onThreadDelete={onHandleThreadDelete} indentCommentContent={false} />
        </div>
      </div>
    );
}

export const ThreadList: React.FC<{ editor: Editor }> = ({ editor }) => {
    const { threads } = useThreads();
    const showComposer = editor.storage.commentHighlight.showComposer;
    return (
      <>
        {showComposer ? <ThreadComposer editor={editor} /> : null}
        <aside aria-label="Comments" className={styles.threadList}>
          {threads.length ? (
            threads
              .sort(sortThreads)
              .map((thread) => (
                <CustomThread key={thread.id} thread={thread} editor={editor} />
              ))
          ) : (
            <NoComments />
          )}
        </aside>
      </>
    );
}

function sortThreads(a: ThreadData, b: ThreadData) {
  if (a.resolved) {
    return 1;
  }

  if (b.resolved) {
    return -1;
  }

  if (a.createdAt > b.createdAt) {
    return -1;
  }

  if (a.createdAt < b.createdAt) {
    return 1;
  }

  return 0;
}