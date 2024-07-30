import { CollaborativeRoom } from "@/components/CollaborativeRoom"
import { onGetDocument } from "@/lib/actions/rooms.action"
import { onGetUsers } from "@/lib/actions/users.action"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"

const Document: React.FC<SearchParamProps> = async ({ params: { id } }) => {
    const user = await currentUser()
    if(!user) redirect('/sign-in')
    console.log('users', user)
    const room = await onGetDocument({ roomId: id, userId: user.emailAddresses[0].emailAddress })

    if(!room) redirect('/')
    console.log('room access', room.usersAccesses)
    const userIds = Object.keys(room.usersAccesses)

    const users = await onGetUsers({ userIds })

    const usersData = users?.map((user) => ({
        ...user,
        userType: room.usersAccesses[user?.email || ''].includes('room:write') ? 'editor' : 'viewer'
    }))

    console.log('usersData', usersData)

    const currentUserType = room.usersAccesses[user.emailAddresses[0].emailAddress].includes('room:write') ? 'editor' : 'viewer'

    return (
        <main className="flex w-full flex-col items-center">
            <CollaborativeRoom 
                roomId={id}
                currentUserType={currentUserType}
                roomMetadata={room.metadata}
                users={usersData}
            /> 
        </main>
    )
}


export default Document