import { auth } from '@/auth';
import OwnerRestaurant from '@/components/admin/owner.restaurant';
import { sendRequest } from '@/utils/api';

const ManageOwnerRestaurantPage = async () => {
    const session = await auth();
    // Log user_id FE để so sánh với BE
    let userId = session?.user?._id;

    let restaurant = null;
    if (userId) {
        // Gọi API lấy restaurant theo user_id, KHÔNG truyền Authorization
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?user_id=${userId}`,
            method: 'GET',
        });
        // Log để debug
        console.log('DEBUG API RESPONSE:', res);
        // Lấy đúng dữ liệu restaurant từ response
        restaurant = res?.data?.result?.[0] || null;
        console.log('DEBUG restaurant:', restaurant);
    }
    return (
        <div>
            <OwnerRestaurant session={session} restaurant={restaurant} />
        </div>
    )
}

export default ManageOwnerRestaurantPage;