"use client";

import { onUpdateDocument } from "@/lib/actions/rooms.action";
import { ClientSideSuspense, RoomProvider, useOthers } from "@liveblocks/react/suspense";
import { Loader } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { Input } from "@/primitives/Input";
import { Editor } from "./Editor/Editor";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";



export const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({ 
  roomId,
  roomMetadata,
  users,
  currentUserType
}) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onUpdateDocumentTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsLoading(true)
    }
    try {
      if(documentTitle !== roomMetadata.title) {
        const updateDocument = await onUpdateDocument(roomId, documentTitle)

        if(updateDocument) {
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const onHandleClickOutside = async (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsEditing(false);
        await onUpdateDocument(roomId, documentTitle);
      }
    }

    document.addEventListener("mousedown", onHandleClickOutside)

    return () => document.removeEventListener('mousedown', onHandleClickOutside)
  }, [roomId, documentTitle])

  useEffect(() => {
    if(isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {isEditing && !isLoading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  onChange={(e) => {
                    setDocumentTitle(e.target.value);
                  }}
                  onKeyDown={onUpdateDocumentTitleHandler}
                  disabled={!isEditing}
                  className="document-title-input"
                  placeholder="Enter document title"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}
              {currentUserType !== "editor" && !isEditing && (
                <p className="view-only-tag">View only</p>
              )}
              {isLoading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
}
