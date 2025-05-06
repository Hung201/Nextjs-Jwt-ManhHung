import { auth } from "@/auth";
import OwnerMenuItemOptionWrapper from "@/components/admin/owner.menu.item.option.wrapper";
import { sendRequest } from "@/utils/api";

const ManageOwnerMenuItemOptionPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
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

    // Lấy tất cả menu items thuộc các menu
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

    // Lấy menu-item-options cho từng menu_item_id, gộp lại
    let allMenuItemOptions: any[] = [];
    for (const menuItem of allMenuItems) {
        const optionsRes: any = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options`,
            method: "GET",
            queryParams: { menu_item_id: menuItem._id },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        });
        const options = optionsRes?.data?.result ?? [];
        allMenuItemOptions = allMenuItemOptions.concat(options);
    }

    // Tính lại meta và slice data cho phân trang FE
    const pageSize = Number(searchParams?.pageSize) || 10;
    const current = Number(searchParams?.current) || 1;
    const total = allMenuItemOptions.length;
    const pages = Math.ceil(total / pageSize);
    const meta = { current, pageSize, total, pages };
    const pagedMenuItemOptions = allMenuItemOptions.slice((current - 1) * pageSize, current * pageSize);

    return (
        <div>
            <OwnerMenuItemOptionWrapper
                menuItemOptions={pagedMenuItemOptions}
                meta={meta}
                menuItems={allMenuItems}
            />
        </div>
    );
};

export default ManageOwnerMenuItemOptionPage;