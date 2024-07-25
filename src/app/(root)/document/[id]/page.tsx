
const Page = ({ params }: {params: { id: string }}) => {
    return <div>
        doc page {params.id}
    </div>
}

export default Page