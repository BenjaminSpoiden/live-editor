"use client"

import { BlockNoteEditor, fileParse, insertOrUpdateBlock } from "@blocknote/core";
import { AddFileButton, createReactBlockSpec, FileToExternalHTML} from "@blocknote/react";
import { FaFilePdf } from "react-icons/fa";
import { PDFRender } from "./PDFRender";
export const onInsertPDFDocument = (editor: BlockNoteEditor) => ({
  title: "Insert a PDF Document",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
        type: 'pdf' as any
    })
  },
  group: "Other",
  aliases: ["pdf"],
  icon: <FaFilePdf size={18} />,
  subtext: "Used to insert a PDF Document.",
});

export const PDFReader = createReactBlockSpec(
  {
    type: "pdf",
    content: "none",
    isFileBlock: true,
    fileBlockAcceptMimeTypes: ["application/pdf"],
    propSchema: {
      name: {
        default: "",
      },
      url: {
        default: "",
      },
      caption: {
        default: "",
      },
    },
  },
  {
    render: (props) => {
      console.log("props", props.block.props);
      return (
        <div className={"bn-file-block-content-wrapper"}>
          {props.block.props.url === "" ? (
            <AddFileButton
              buttonText="Add PDF Document"
              buttonIcon={<FaFilePdf size={24} />}
              editor={props.editor as any}
              block={props.block}
            />
          ) : (
            <>
              <PDFRender props={props} />
            </>
          )}
        </div>
      );
    },
    parse: fileParse,
    toExternalHTML: (_props) => (
      <FileToExternalHTML {...(_props as any)}>
        <PDFRender props={_props} />
      </FileToExternalHTML>
    ),
  }
);
