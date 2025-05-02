export interface HomeCardProps {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    onAddToCart: (id: string) => void;
} 