'use server'

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserColor } from "../utils"
import { liveblocks } from "../liveblocks"

export const onAuthorizeLiveblocksAction = async () => {

    const clerkUser = await currentUser()
    
    if(!clerkUser) redirect('/sign-in');
    
    const { id, firstName, lastName, emailAddresses, imageUrl, username } = clerkUser
    // const anonymousUser = {
    //   id: "anonymous",
    //   info: {
    //     id: "anonymous",
    //     username: "Anonymous",
    //     email: '',
    //     color: "#ff0000",
    //     avatar: ''
    //   },
    // };

    // const user = clerkUser ? {
    //     id: clerkUser.id,
    //     info: {
    //         id: clerkUser.id,
    //         username: clerkUser.username || `${clerkUser.firstName} ${clerkUser.lastName}`,
    //         email: clerkUser.emailAddresses.at(0)?.emailAddress || '',
    //         avatar: clerkUser.imageUrl,
    //         color: getUserColor(clerkUser.id)
    //     }
    // } : anonymousUser

    const user = {
      id,
      info: {
        id,
        name: `${firstName} ${lastName}`,
        username: username || '',
        email: emailAddresses[0].emailAddress,
        avatar: imageUrl,
        color: getUserColor(id) as string
      }
    }

    const {status, body} =  await liveblocks.identifyUser({
      userId: user.id, 
      groupIds: []
    }, {
      userInfo: user.info
    })

    if(status !== 200) {
        return {
          error: {
            code: 401,
            message: "No access",
            suggestion: "You don't have access to this Liveblocks room",
          },
        };
    }

    if(!body) {
        return {
          error: {
            code: 404,
            message: "ID token issue",
            suggestion: "Contact an administrator",
          },
        };
    }

    return { data: JSON.parse(body) }
}