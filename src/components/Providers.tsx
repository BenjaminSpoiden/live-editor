'use client'
import React, { PropsWithChildren } from "react";
import {
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { onAuthorizeLiveblocksAction } from "@/lib/actions/authorizeLiveblocks.action";
import Router from "next/router";
import { onGetDocumentUsers, onGetUsers } from "@/lib/actions/users.action";
import { useUser } from "@clerk/clerk-react";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser()
  return (
    <LiveblocksProvider 
      authEndpoint={async () => {
        const { data, error } = await onAuthorizeLiveblocksAction()
        if (error) {
          Router.push({
            query: {
              ...Router.query,
              error: encodeURIComponent(JSON.stringify(error)),
            },
          });
          return;
        }
        return data
      }}
      resolveUsers={async ({ userIds }) => {
        const users = await onGetUsers({ userIds })

        return users
      }}
      resolveMentionSuggestions={async ({ roomId, text }) => {
        const roomUsers = await onGetDocumentUsers({ roomId, currentUser: user?.id || '', text }) as string[];
        return roomUsers
      }}
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </LiveblocksProvider>
  )
};