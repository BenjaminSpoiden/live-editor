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

        return room
    } catch (error) {
        console.error('Error creating document: ', error)
    }
}

export const onGetDocument = async ({roomId, userId}: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        const hasAccess = Object.keys(room.usersAccesses).includes(userId)
        if (!hasAccess) {
          throw new Error("You do not have access to this document");
        }

        return room
    } catch (error) {
        console.error('Problem getting Room: ', error)
    }
}

export const onGetDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email })
        return rooms
    } catch (error) {
        console.error(`Error happened while getting rooms: ${error}`);
    }
} 

export const onUpdateDocument = async (roomId: string, documentTitle: string) => {
    try {
        const room = await liveblocks.updateRoom(roomId, {
            metadata: {
                title: documentTitle
            }
        })
        return room
    } catch (error) {
        console.error('Error happened while updating document: ', error)
    }
}