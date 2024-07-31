'use client'
import React, { PropsWithChildren } from "react";
import {
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { onGetDocumentUsers, onGetUsers } from "@/lib/actions/users.action";
import { useUser } from "@clerk/clerk-react";


export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser()
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await onGetUsers({ userIds });

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await onGetDocumentUsers({
          roomId, 
          currentUser: user?.emailAddresses[0].emailAddress || '',
          text
        })
        return roomUsers;
      }}
    >
      {children}
    </LiveblocksProvider>
  );
};