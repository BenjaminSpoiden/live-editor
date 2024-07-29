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

type LiveblocksDocument = {
  id: string;
  name: string;
  accesses: DocumentAccesses;
  owner: DocumentUser["id"];
  created: string;
  lastConnection: string;
  draft: boolean;
  type: DocumentType;
}

type DocumentType = "text" | "whiteboard" | "spreadsheet";

type DocumentGroup = Group & {
  access: DocumentAccess
}

type DocumentUser = User & {
  access: DocumentAccess
  isCurrentUser: boolean 
}

enum DocumentAccess {
  FULL = "full",
  EDIT = "edit",
  READONLY = "readonly",
  NONE = "none",
}

type AccessType = ["room:write"] | ["room:read", "room:presence:write"]

type RoomAccesses = Record<string, AccessType>;

type DocumentAccesses = {
  default: DocumentAccess;
  groups: Record<DocumentGroup["id"], DocumentAccess>;
  users: Record<DocumentUser["id"], DocumentAccess>;
};

interface DocumentRoomMetadata
  extends Record<string, string | string[]> {
  name: Document["name"];
  type: DocumentType;
  owner: User["id"];
  draft: "yes" | "no";
}

type ErrorData = {
  message: string;
  code?: number;
  suggestion?: string;
};

interface CommentHighlightOptions {
  HTMLAttributes: Record<string, any>;
}

interface CommentHighlightStorage {
  showComposer: boolean;
  currentHighlightId: string | null;
  activeHighlightId: string | null;
}

interface CustomStorage {
  commentHighlight: CommentHighlightStorage;
}

