import Verify from "@/components/features/auth/verify"

const VerifyPage = ({ params }: { params: { id: string } }) => {
    const { id } = params
    return (
        <>
            <Verify
                id={id}
            />
        </>
    )
}

export default VerifyPage