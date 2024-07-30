'use client'
import { useOthers, useSelf } from "@liveblocks/react/suspense"
import styles from "./Avatars.module.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/Avatar"
import { cn } from "@/lib/utils"

export const Avatars = () => {
    const users = useOthers()
    const currentUser = useSelf()
    return (
      <div className={styles.avatars}>
        {users.map(({ connectionId, info }) => (
          <Avatar key={connectionId} className={styles.avatar}>
            <AvatarImage src={info.avatar} />
            <AvatarFallback>{info.username}</AvatarFallback>
          </Avatar>
        ))}
        {currentUser && (
          <div className="relative ml-8 first:ml-0">
            <Avatar className={cn(styles.avatar)}>
              <AvatarImage src={currentUser.info.avatar} />
              <AvatarFallback>{currentUser.info.username}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    );
}