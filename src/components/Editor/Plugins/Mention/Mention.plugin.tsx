'use client'
import { BlockNoteEditor } from "@blocknote/core";
import { createReactInlineContentSpec } from "@blocknote/react";
import { User } from "@liveblocks/client";

export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <span
        className="bg-[#8400ff33]"
      >
        @{props.inlineContent.props.user}
      </span>
    ),
  }
);

export const onGetMentionMenuItems = (editor: BlockNoteEditor, users: readonly User[]) => {
    return users.map((user) => ({
        id: user.id,
        onItemClick: () => {
            editor.insertInlineContent([
                {
                    type: 'mention',
                    props: {
                        user
                    }
                },
                " "
            ])
        },
        icon: <p>{user.info?.username?.substring(0, 1)}</p>
    }))
}