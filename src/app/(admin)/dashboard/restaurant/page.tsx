import RestaurantTableWrapper from "@/components/admin/restaurant.table.wrapper";
import { getRestaurantsWithPagination } from "@/utils/actions";
import { Suspense } from "react";

interface IProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const ManageRestaurantPage = async ({ searchParams }: IProps) => {
    const page = searchParams['current'] ? Number(searchParams['current']) : 1;
    const limit = searchParams['pageSize'] ? Number(searchParams['pageSize']) : 10;

    const res = await getRestaurantsWithPagination(page, limit);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RestaurantTableWrapper
                restaurants={res?.data?.result ?? []}
                meta={{
                    current: page,
                    pageSize: limit,
                    total: res?.data?.meta?.total ?? 0,
                    pages: res?.data?.meta?.pages ?? 0
                }}
            />
        </Suspense>
    )
}

export default ManageRestaurantPage;