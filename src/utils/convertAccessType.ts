import { RoomPermission } from "@liveblocks/node";

/**
 * Convert from Liveblocks room accesses to a custom document access format
 * If the user was set on userAccesses, give FULL permissions to edit invited users
 */
export function roomAccessesToDocumentAccess(
  roomAccesses: RoomPermission | null,
  setOnUserAccesses = false
): DocumentAccess {
  if (!roomAccesses) {
    return DocumentAccess.NONE;
  }

  if (roomAccesses[0] === "room:write") {
    return setOnUserAccesses ? DocumentAccess.FULL : DocumentAccess.EDIT;
  }

  if (
    roomAccesses[0] === "room:read" &&
    roomAccesses[1] === "room:presence:write"
  ) {
    return DocumentAccess.READONLY;
  }

  return DocumentAccess.NONE;
}

/**
 * Convert from a custom document access format to native Liveblocks room accesses
 */
export function documentAccessToRoomAccesses(
  documentAccess: DocumentAccess
): RoomPermission {
  if (
    documentAccess === DocumentAccess.FULL ||
    documentAccess === DocumentAccess.EDIT
  ) {
    return ["room:write"];
  }

  if (documentAccess === DocumentAccess.READONLY) {
    return ["room:read", "room:presence:write"];
  }

  return [];
}