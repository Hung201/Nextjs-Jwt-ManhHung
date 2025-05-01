export type PaymentMethod = 'COD' | 'BANKING';

export interface CheckoutFormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
    paymentMethod: PaymentMethod;
}

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    options?: Record<string, string | null>;
}

export interface OrderData extends CheckoutFormData {
    items: OrderItem[];
    totalAmount: number;
    shippingFee: number;
    orderDate: Date;
} 