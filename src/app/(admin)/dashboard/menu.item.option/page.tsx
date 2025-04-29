import { auth } from "@/auth";
import MenuItemOptionWrapper from "@/components/admin/menu.item.option.wrapper";
import { sendRequest } from "@/utils/api";

const ManageMenuItemOptionPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();

    // Fetch menu item options
    const menuItemOptionsRes = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    // Fetch menu items
    const menuItemsRes = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    // Safely extract data
    const menuItemOptionsData = (menuItemOptionsRes as any)?.data ?? {};
    const menuItemsData = (menuItemsRes as any)?.data ?? {};

    return (
        <div>
            <MenuItemOptionWrapper
                menuItemOptions={menuItemOptionsData.result ?? []}
                meta={menuItemOptionsData.meta}
                menuItems={menuItemsData.result ?? []}
            />
        </div>
    );
};

export default ManageMenuItemOptionPage; 