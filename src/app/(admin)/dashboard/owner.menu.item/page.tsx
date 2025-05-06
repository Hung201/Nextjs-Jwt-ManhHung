import { auth } from "@/auth";
import OwnerMenuItemsWrapper from "@/components/admin/owner.menu.items.wrapper";
import { sendRequest } from "@/utils/api";

const ManageOwnerMenuItemPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const session = await auth();
    const userId = session?.user?._id;
    if (!userId) return <div>Không tìm thấy user</div>;

    // Lấy restaurant của owner hiện tại
    let restaurant: any = null;
    const res: any = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?user_id=${userId}`,
        method: "GET",
    });
    restaurant = res?.data?.result?.[0] || null;
    if (!restaurant?._id) return <div>Không tìm thấy restaurant</div>;
    const restaurant_id = restaurant._id;

    // Lấy tất cả menu thuộc restaurant_id
    const menusRes: any = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "GET",
        queryParams: { restaurant_id },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });
    const menus = menusRes?.data?.result ?? [];

    // Lấy menu-items cho từng menu_id, gộp lại
    let allMenuItems: any[] = [];
    for (const menu of menus) {
        const menuItemsRes: any = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
            method: "GET",
            queryParams: { menu_id: menu._id },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        });
        const items = menuItemsRes?.data?.result ?? [];
        allMenuItems = allMenuItems.concat(items);
    }

    // Tính lại meta và slice data cho phân trang FE
    const pageSize = Number(searchParams?.pageSize) || 10;
    const current = Number(searchParams?.current) || 1;
    const total = allMenuItems.length;
    const pages = Math.ceil(total / pageSize);
    const meta = { current, pageSize, total, pages };
    const pagedMenuItems = allMenuItems.slice((current - 1) * pageSize, current * pageSize);

    return (
        <div>
            <OwnerMenuItemsWrapper
                menuItems={pagedMenuItems}
                meta={meta}
                menus={menus}
            />
        </div>
    );
};

export default ManageOwnerMenuItemPage;