import { auth } from "@/auth";
import MenuItemsWrapper from "@/components/admin/menu.items.wrapper";
import { sendRequest } from "@/utils/api";

const ManageMenuItemsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();

    // Lấy danh sách menu items
    const menuItemsRes = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    // Lấy danh sách menus
    const menusRes = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    // Fix linter error: safely extract .data
    const menuItemsData = (menuItemsRes as any)?.data ?? {};
    const menusData = (menusRes as any)?.data ?? {};

    return (
        <div>
            <MenuItemsWrapper
                menuItems={menuItemsData.result ?? []}
                meta={menuItemsData.meta}
                menus={menusData.result ?? []}
            />
        </div>
    );
};

export default ManageMenuItemsPage; 