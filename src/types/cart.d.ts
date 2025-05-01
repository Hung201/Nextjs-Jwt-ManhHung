export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedOptions?: Record<string, string | null>;
} 