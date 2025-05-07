import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';
import OwnerOrderTableWrapper from '@/components/admin/owner.order.table.wrapper';

const ManageOwnerOrderPage = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();
    const userId = session?.user?._id;
    // Lấy restaurant của owner hiện tại
    let restaurant: any = null;
    if (userId) {
        const res: any = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?user_id=${userId}`,
            method: 'GET',
        });
        restaurant = res?.data?.result?.[0] || null;
    }
    if (!restaurant?._id) return <div>Không tìm thấy restaurant</div>;
    const restaurant_id = restaurant._id;
    // Lấy danh sách order chỉ của restaurant này
    const res: any = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: 'GET',
        queryParams: { current, pageSize, restaurant_id },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });
    const orders = res?.data?.result ?? [];
    const meta = res?.data?.meta ?? { current: 1, pageSize: 10, pages: 1, total: orders.length };
    return (
        <div>
            <OwnerOrderTableWrapper orders={orders} meta={meta} />
        </div>
    );
};

export default ManageOwnerOrderPage;