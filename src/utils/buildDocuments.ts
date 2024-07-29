import { RoomData } from "@liveblocks/node";
import { roomAccessesToDocumentAccess } from "./convertAccessType";


export const buildDocuments = (roomData: RoomData): LiveblocksDocument => {

    const metadata = roomData.metadata

    const name: LiveblocksDocument['name'] = metadata.name ? metadata.name as string : 'Untilted' 
    const owner: LiveblocksDocument["owner"] = metadata.owner ? metadata.owner as string : ''
    const draft: LiveblocksDocument['draft'] = metadata.draft === 'yes' ? true : false

    const defaultAccesses: LiveblocksDocument['accesses']['default'] = roomAccessesToDocumentAccess(roomData.defaultAccesses)

    const groups: LiveblocksDocument['accesses']['groups'] = {}
    Object.entries(roomData.groupsAccesses).map(([id, accessValue]) => {
        if (accessValue) {
          groups[id] = roomAccessesToDocumentAccess(accessValue);
        }
    });

    const users: LiveblocksDocument["accesses"]["users"] = {};
    Object.entries(roomData.usersAccesses).map(([id, accessValue]) => {
      if (accessValue) {
        users[id] = roomAccessesToDocumentAccess(accessValue);
      }
    });

    const created = roomData.createdAt.toString()
    const lastConnection = roomData.lastConnectionAt ? roomData.lastConnectionAt.toString() : created


    return {
        id: roomData.id,
        name,
        accesses: {
            default: defaultAccesses,
            groups,
            users
        },
        created,
        draft,
        owner,
        type: metadata.type as unknown as DocumentType,
        lastConnection
    }
 
}
