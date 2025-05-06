import { auth } from "@/auth";
import OwnerMenuTableWrapper from "@/components/admin/owner.menu.table.wrapper";
import { sendRequest } from "@/utils/api";

const ManageOwnerMenusPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();
    const userId = session?.user?._id;

    // Lấy restaurant của owner hiện tại
    let restaurant: any = null;
    if (userId) {
        const res: any = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?user_id=${userId}`,
            method: "GET",
        });
        restaurant = res?.data?.result?.[0] || null;
    }
    const restaurant_id = restaurant?._id;

    // Lấy danh sách menus theo restaurant_id (chỉ của owner)
    const menuRes: any = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "GET",
        queryParams: { current, pageSize, restaurant_id },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ["list-menus"] } },
    });

    // Lấy danh sách restaurants (nếu cần cho dropdown)
    const restaurantRes: any = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ["restaurants"] } },
    });

    return (
        <div>
            <OwnerMenuTableWrapper
                menus={menuRes?.data?.result ?? []}
                meta={menuRes?.data?.meta}
                restaurants={restaurant ? [restaurant] : []}
            />
        </div>
    );
};

export default ManageOwnerMenusPage;