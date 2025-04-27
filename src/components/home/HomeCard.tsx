'use client';
import React from 'react';
import { Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface HomeCardProps {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    onAddToCart: (id: string) => void;
}

const HomeCard: React.FC<HomeCardProps> = ({
    id,
    name,
    description,
    image,
    rating,
    onAddToCart
}) => {
    return (
        <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1">{name}</h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">{description}</p>

                <div className="flex items-center justify-between">
                    <Rate disabled defaultValue={rating} allowHalf className="text-sm" />
                </div>
            </div>
        </div>
    );
};

export default HomeCard; 