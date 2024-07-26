'use client'
import { Editor } from "@/components/Editor/Editor";
import { LiveMap } from "@liveblocks/core";
import { RoomProvider } from "@liveblocks/react/suspense";

const Page = () => {
  return (
    <RoomProvider 
      id="room-id"
      initialPresence={{ cursor: null }}
      initialStorage={{ notes: new LiveMap() }}
    >
      <Editor />
    </RoomProvider>
  );
}

export default Page