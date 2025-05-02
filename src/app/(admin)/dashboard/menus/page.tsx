import { auth } from "@/auth";
import MenuTableWrapper from "@/components/admin/menu.table.wrapper";
import { sendRequest } from "@/utils/api";

const ManageMenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 8;
    const session = await auth();

    // Lấy danh sách menus
    const menuRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ["list-menus"] } },
    });

    // Lấy danh sách restaurants
    const restaurantRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ["restaurants"] } },
    });

    return (
        <div>
            <MenuTableWrapper
                menus={menuRes?.data?.result ?? []}
                meta={menuRes?.data?.meta}
                restaurants={restaurantRes?.data?.result ?? []}
            />
        </div>
    );
};

export default ManageMenuPage; 