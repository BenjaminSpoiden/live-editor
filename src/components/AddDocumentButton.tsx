'use client'
import { onCreateDocumentAction } from "@/lib/actions/rooms.action";
import { Button } from "@/primitives/Button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type AddDocumentButtonProps = {
    userId: string,
    email: string
}

export const AddDocumentButton: React.FC<AddDocumentButtonProps> = ({ userId, email }) => {
    const router = useRouter()

    const onAddDocumentHandler = async () => {
        try {
            const room = await onCreateDocumentAction({ userId, email })
            if(room) router.push(`/document/${room.id}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
      <Button
        type="submit"
        onClick={onAddDocumentHandler}
        className="gradient-blue flex gap-1 shadow-md"
      >
        <PlusIcon className="w-6 h-6" />
      </Button>
    );
}