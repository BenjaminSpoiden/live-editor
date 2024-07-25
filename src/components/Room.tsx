'use client'
import React, { PropsWithChildren } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export const Room: React.FC<PropsWithChildren> = ({ children }) => (
  <LiveblocksProvider publicApiKey="pk_dev_uuktwkbUeEaOZWq56PUSlWzroHGEEadZspCZFeqAiQeMWfA3F7xRLleAZYlt6IrE">
    <RoomProvider id="room-id">
        <ClientSideSuspense fallback={<div>Loading...</div>}>
            {children}
        </ClientSideSuspense>
    </RoomProvider>
  </LiveblocksProvider>
);