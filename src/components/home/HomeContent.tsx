'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Typography, message, SelectProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import { startProgress, doneProgress, navigateWithProgress } from '@/utils/nprogress';
import { Restaurant, PaginationState, RestaurantResponse } from '@/types/restaurant';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import { getRestaurantsWithPagination } from '@/utils/actions';

const { Title } = Typography;

// Dynamically import components that might cause hydration issues
const Input = dynamic(() => import('antd').then(mod => mod.Input), { ssr: false });
const Select = dynamic(() => import('antd').then(mod => mod.Select), { ssr: false });
const Pagination = dynamic(() => import('antd').then(mod => mod.Pagination), {
    ssr: false,
    loading: () => <div className="h-8" /> // Placeholder for pagination height
});

type SortByType = 'popular' | 'rating' | 'a-z' | 'z-a';

const HomeContent = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('popular');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 8,
        total: 0,
        pages: 1
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, [pagination.current, pagination.pageSize]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await getRestaurantsWithPagination(pagination.current, pagination.pageSize);
            if (response.statusCode === 200) {
                setRestaurants(response.data.result);
                setPagination({
                    ...pagination,
                    total: response.data.meta.total,
                    pages: response.data.meta.pages
                });
            }
        } catch (error) {
            message.error('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (id: string) => {
        message.success('Added to cart!');
    };

    const handleCardClick = (id: string) => {
        navigateWithProgress(() => {
            router.push(`/product/${id}`);
        });
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize
        });
    };

    const handleSortChange = (value: unknown) => {
        if (value === 'popular' || value === 'rating' || value === 'a-z' || value === 'z-a') {
            setSortBy(value);
        }
    };

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchText(value.toLowerCase());
        }, 300),
        []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    // Memoize the filtered and sorted restaurants
    const displayedRestaurants = useMemo(() => {
        let result = [...restaurants];

        // Apply search filter
        if (searchText) {
            result = result.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchText) ||
                restaurant.address.toLowerCase().includes(searchText)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'a-z':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'z-a':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            // 'popular' is default, no need to sort
        }

        return result;
    }, [restaurants, searchText, sortBy]);

    const sortOptions = [
        { value: 'popular', label: 'Popular' },
        { value: 'rating', label: 'Rating' },
        { value: 'a-z', label: 'A-Z' },
        { value: 'z-a', label: 'Z-A' }
    ];

    return (
        <>
            <Row gutter={[24, 24]}>

                <Col span={24}>
                    <div className="mb-6">
                        <div className="flex gap-4 mb-6">
                            <Input
                                placeholder="Search restaurants..."
                                prefix={<SearchOutlined />}
                                onChange={handleSearch}
                                allowClear
                                className="max-w-[300px]"
                            />
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="w-[200px]"
                                options={sortOptions}
                            />
                        </div>
                    </div>

                    <Row gutter={[16, 16]}>
                        {displayedRestaurants.map((restaurant) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={restaurant._id}>
                                <div
                                    onClick={() => handleCardClick(restaurant._id)}
                                    className="cursor-pointer"
                                >
                                    <HomeCard
                                        id={restaurant._id}
                                        name={restaurant.name}
                                        description={restaurant.address}
                                        image={restaurant.image}
                                        rating={restaurant.rating}
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {displayedRestaurants.length === 0 && !loading && (
                        <div className="text-center text-gray-500 py-8">
                            No restaurants found
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `Total ${total} restaurants`}
                        />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default HomeContent; 