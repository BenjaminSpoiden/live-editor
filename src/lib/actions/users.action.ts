'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { liveblocks } from "../liveblocks";

export const onGetUsers = async ({ userIds }: {userIds: string[]}) => {
    try {
        const client = clerkClient()
        const { data } = await client.users.getUserList({ emailAddress: userIds })

        const users = data.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          username: `${user.username}`,
          email: user.emailAddresses[0].emailAddress,
          avatar: user.imageUrl,
        }));

        const sortedUser = userIds.map((email) => users.find((user => user.email === email)))

        return sortedUser
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
    }
}

export const onGetDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser)

        if (text.length) {
          const lowerCaseText = text.toLowerCase();

          const filteredUsers = users.filter((email: string) =>
            email.toLowerCase().includes(lowerCaseText)
          );

          return JSON.parse(JSON.stringify(filteredUsers));
        }

        return JSON.parse(JSON.stringify(users))

    } catch (error) {
        console.error(`Error fetching document users: ${error}`);
    }
}