'use client';
import RestaurantTable from "./restaurant.table";

interface IProps {
    restaurants: any[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}

const RestaurantTableWrapper = ({ restaurants, meta }: IProps) => {
    return (
        <RestaurantTable
            restaurants={restaurants}
            meta={meta}
        />
    )
}

export default RestaurantTableWrapper; 