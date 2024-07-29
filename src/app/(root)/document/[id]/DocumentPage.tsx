'use client'
import { Editor } from "@/components/Editor/Editor"
import { LiveMap } from "@liveblocks/client"
import { RoomProvider } from "@liveblocks/react/suspense"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"

type DocumentProps = {
    initialDocument: LiveblocksDocument | null
    initialError: ErrorData | null
}

export const DocumentPage: React.FC<DocumentProps> = ({ initialDocument, initialError }) => {
    const { id, error: queryError } = useParams<{ id: string; error: string }>()
    const [error, setError] = useState(initialError)

    useEffect(() => {
        if(queryError) {
            setError(JSON.parse(decodeURIComponent(queryError)))
        }
    }, [queryError])

    if(error) {
        return <div>ERROR {error.message}</div>
    }

    if(!initialDocument) {
        return <div>NO INITIAL LAYOUT</div>
    }

    return (
        <RoomProvider
            id={id}
            initialPresence={{ cursor: null }}
            initialStorage={{ notes: new LiveMap() }}
        >
            <Editor />
        </RoomProvider>
    )
}