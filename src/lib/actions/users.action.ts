'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { liveblocks } from "../liveblocks";
import { getUserColor } from "../utils";

export const onGetUsers = async ({ userIds }: {userIds: string[]}) => {
    try {
        const { data } = await clerkClient.users.getUserList({ userId: userIds })

        const users = data.map((user) => ({
          id: user.id,
          username: `${user.username}`,
          email: user.emailAddresses[0].emailAddress,
          avatar: user.imageUrl,
          color: getUserColor(user.id) as string
        }));

        const sortedUser = userIds.map((_id) => users.find((({ id }) => id === _id)))

        return sortedUser
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
    }
}

export const onGetDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        const users = Object.keys(room.usersAccesses).filter((id) => id !== currentUser)

        if (text.length) {
          const lowerCaseText = text.toLowerCase();

          const filteredUsers = users.filter((id: string) =>
            id.toLowerCase().includes(lowerCaseText)
          );

          return filteredUsers;
        }

        return users

    } catch (error) {
        console.error(`Error fetching document users: ${error}`);
    }
}