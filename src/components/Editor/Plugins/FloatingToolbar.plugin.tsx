'use client'

import { Button } from "@/primitives/Button"
import { CommentIcon } from "@/primitives/Icons/CommentIcon"
import { createDOMRange } from "@/utils/domUtils"
import { autoUpdate, flip, hide, limitShift, offset, shift, size, useFloating } from "@floating-ui/react-dom"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OPEN_FLOATING_COMPOSER_COMMAND } from "@liveblocks/react-lexical"
import { $getSelection, $isRangeSelection } from "lexical"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"

export const FloatingToolbar: React.FC = () => {
    const [editor] = useLexicalComposerContext()

    const [range, setRange] = useState<Range | null>(null)

    useEffect(() => {
        editor.registerUpdateListener(({ tags }) => {
            return editor.getEditorState().read(() => {
                if (tags.has('collaboration')) return
                
                const selection = $getSelection()
                if(!$isRangeSelection(selection) || selection.isCollapsed()) {
                    setRange(null)
                    return
                }

                const { anchor, focus } = selection

                const range = createDOMRange(
                    editor,
                    anchor.getNode(),
                    anchor.offset,
                    focus.getNode(),
                    focus.offset
                )

                setRange(range)
            })
        })
    }, [editor])

    if(!range) return null

    return <Toolbar range={range} onRangeChange={setRange} container={document.body}/>
}

function Toolbar({ 
    range, 
    onRangeChange, 
    container 
}: { 
    range: Range, 
    onRangeChange: (range: Range | null) => void, 
    container: HTMLElement 
}) {
    const [editor] = useLexicalComposerContext()
    const padding = 20

    const {
        refs: { setFloating, setReference },
        strategy,
        x,
        y
    } = useFloating({
        strategy: 'fixed',
        placement: 'bottom',
        middleware: [
            flip({ padding, crossAxis: false }),
            offset(10),
            hide({ padding }),
            shift({ padding, limiter: limitShift() }),
            size({ padding })
        ],
        whileElementsMounted: (...args) => {
            return autoUpdate(...args, {
                animationFrame: true
            })
        }
    })

    useLayoutEffect(() => {
        setReference({
            getBoundingClientRect: () => range.getBoundingClientRect()
        })
    }, [setReference, range])

    return createPortal(
        <div 
            ref={setFloating}
            style={{
                position: strategy,
                top: 0,
                left: 0,
                transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
                minWidth: 'max-content'
            }}
        >
            <div>
                <Button
                    size="icon"
                    onClick={() => {
                        const isOpen = editor.dispatchCommand(OPEN_FLOATING_COMPOSER_COMMAND, undefined)
                        if(isOpen) {
                            onRangeChange(null);
                        }
                        
                    }}
                >
                    <CommentIcon className="w-6 h-6" />
                </Button>
            </div>
        </div>,
        container
    )
}