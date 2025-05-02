'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { PlusOutlined } from '@ant-design/icons';
import { HomeCardProps } from '@/types/home';

// Dynamically import Rate component
const Rate = dynamic(() => import('antd').then(mod => mod.Rate), {
    ssr: false,
    loading: () => <div className="h-[20px]" /> // Placeholder to prevent layout shift
});

const HomeCard: React.FC<HomeCardProps> = ({
    id,
    name,
    description,
    image,
    rating,
    onAddToCart
}) => {
    return (
        <div className="group h-[360px] flex flex-col relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Image Container - Fixed height */}
            <div className="relative h-[200px] w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content Container - Fixed height with ellipsis */}
            <div className="flex flex-col flex-1 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1 h-[28px]">{name}</h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2 flex-1">{description}</p>

                <div className="mt-auto">
                    <Rate
                        disabled
                        defaultValue={rating}
                        allowHalf
                        className="!text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeCard; 