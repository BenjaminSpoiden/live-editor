'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createParagraphNode, $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical'
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Heading1, Heading2, Heading3, ItalicIcon, Quote, RedoIcon, StrikethroughIcon, UnderlineIcon, UndoIcon } from 'lucide-react';
import { useActiveBlock } from '@/hooks/useActiveBlock';
import { Button } from '@/primitives/Button';
import { Separator } from '@/primitives/Separator';
import { ToggleGroup, ToggleGroupItem } from '@/primitives/ToggleGroup';


export const ToolbarPlugin: React.FC = () => {
    const [editor] = useLexicalComposerContext()
    const toolbarRef = useRef<HTMLDivElement>(null)

    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)


    const activeBlock = useActiveBlock()

    const onUpdateToolbar = useCallback(() => {
        const selection = $getSelection()

        if($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
        }
    }, [])

    useEffect(() => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            onUpdateToolbar();
          });
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (_payload, _newEditor) => {
            onUpdateToolbar();
            return false;
          },
          1
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          1
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          1
        )
      );
    }, [editor, onUpdateToolbar]);

    const toggleBlock = (type: 'h1' | 'h2' | 'h3' | 'quote') => {
        const selection = $getSelection()

        if(activeBlock === type) {
            return $setBlocksType(selection, () => $createParagraphNode())
        }

        if (type === 'h1') {
            return $setBlocksType(selection, () => $createHeadingNode('h1'))
        }

        if (type === 'h2') {
            return $setBlocksType(selection, () => $createHeadingNode('h2'))
        }

        if (type == 'h3') {
            return $setBlocksType(selection, () => $createHeadingNode('h3'))
        }
        if (type === 'quote') {
            return $setBlocksType(selection, () => $createQuoteNode())
        }
    }

    return (
      <div ref={toolbarRef}>
        <Button
          size="icon"
          disabled={!canUndo}
          aria-label="Undo"
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <UndoIcon />
        </Button>
        <Button
          size="icon"
          disabled={!canRedo}
          aria-label="Redo"
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <RedoIcon />
        </Button>

        <Separator orientation="vertical" />

        <ToggleGroup type="multiple">
          <ToggleGroupItem
            value="heading-1"
            onClick={() => editor.update(() => toggleBlock("h1"))}
            aria-label="toggle heading-1"
          >
            <Heading1 className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heading-2"
            onClick={() => {
              editor.update(() => toggleBlock("h2"));
            }}
          >
            <Heading2 className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heading-3"
            onClick={() => {
              editor.update(() => toggleBlock("h3"));
            }}
          >
            <Heading3 className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="quote"
            onClick={() => {
              editor.update(() => toggleBlock("quote"));
            }}
          >
            <Quote className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" />

        <ToggleGroup type="multiple">
          <ToggleGroupItem
            value="bold"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
          >
            <BoldIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          >
            <ItalicIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
          >
            <StrikethroughIcon className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" />

        <ToggleGroup type="multiple">
          <ToggleGroupItem
            value="align-left"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
          >
            <AlignLeftIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-center"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
          >
            <AlignCenterIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-right"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
          >
            <AlignRightIcon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-justify"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
            }
          >
            <AlignJustifyIcon className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
}