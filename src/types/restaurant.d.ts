export interface Restaurant {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    rating: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
}

export interface RestaurantResponse {
    statusCode: number;
    message: string;
    data: {
        meta: PaginationState;
        result: Restaurant[];
    };
} 