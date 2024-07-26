type User = {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  groupIds: string[];
};

type Group = {
  id: string;
  name: string;
};

type CreateDocumentParams = {
    userId: string,
    email: string
}

type AccessType = ["room:write"] | ["room:read", "room:presence:write"]

type RoomAccesses = Record<string, AccessType>;
