import { getDocument } from "@/lib/actions/rooms.action"
import { DocumentPage } from "./DocumentPage"

const Document = async ({ params }: {params: { id: string }}) => {
    const { data = null, error = null } = await getDocument({ documentId: params.id })
    return <DocumentPage initialDocument={data} initialError={error} />
}

export default Document