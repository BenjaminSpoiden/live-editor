'use server'
import { nanoid } from "@liveblocks/core"
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";

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