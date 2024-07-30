'use client'

import React, { useEffect, useState } from "react"
import { useRoom } from "@liveblocks/react/suspense"
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNote } from "./BlockNote"

type EditorProps = {
  roomId: string
  currentUserType: UserType
}

const Placeholder = () => <div>Some placeholder text...</div>

export const Editor: React.FC<EditorProps> = ({ roomId, currentUserType }) => {
  const room = useRoom()
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<any>()


  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProdiver = new LiveblocksYjsProvider(room, yDoc)
    setDoc(yDoc)
    setProvider(yProdiver)

    return () => {
      yDoc.destroy()
      yProdiver.destroy()
    }
  }, [room])

  if(!doc || !provider) {
    return null
  }

  return <BlockNote doc={doc} provider={provider} />
}