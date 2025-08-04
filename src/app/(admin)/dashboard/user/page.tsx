import { UserTable } from "@/components/features/admin/users";
import { getUsersAction } from "@/utils/actions/user.actions";

interface IProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}
const ManageUserPage = async (props: IProps) => {

    const current = props?.searchParams?.current ?? 1;
    const pageSize = props?.searchParams?.pageSize ?? 10;

    const res = await getUsersAction(Number(current), Number(pageSize));

    return (
        <div>
            <UserTable
                users={res?.data?.results ?? []}
                meta={res?.data?.meta}
            />
        </div>
    )
}

export default ManageUserPage;
