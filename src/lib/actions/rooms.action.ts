'use server'
import { nanoid } from "@liveblocks/core"
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { buildDocuments } from "@/utils/buildDocuments";

export const onCreateDocumentAction = async ({ userId, email }: CreateDocumentParams) => {

    const roomId = nanoid()
    
    try {
        const metadata = {
            createdId: userId,
            email,
            title: 'Untilted Document'
        }

        const usersAccesses: RoomAccesses = { [email]: ["room:write"] };

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            defaultAccesses: ["room:read", "room:presence:write"],
            usersAccesses
        });
        revalidatePath('/')

        return JSON.stringify(room)
    } catch (error) {
        console.error('Error creating document: ', error)
    }
}

export const getDocument = async ({documentId}: { documentId: string }) => {
    try {
        const room = await liveblocks.getRoom(documentId)
        if (!room) {
            return {
              error: {
                code: 404,
                message: "Document not found",
                suggestion: "Check that you're on the correct page",
              },
            };
        }

        const document: LiveblocksDocument = buildDocuments(room);

        return { data: document }
    } catch (error) {
        console.error('Problem getting Room: ', error)
        return {
            error: {
              code: 500,
              message: "Error fetching document",
              suggestion: "Refresh the page and try again",
            },
        };
    }
    
}