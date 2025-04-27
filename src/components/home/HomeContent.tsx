'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Typography, message, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import { startProgress } from '@/utils/nprogress';
import { getRestaurants } from '@/services/apiServices';
import { Restaurant, PaginationState, RestaurantResponse } from '@/types/restaurant';

const { Title } = Typography;
const { Option } = Select;

const HomeContent = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 4,
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
            const response: RestaurantResponse = await getRestaurants(pagination.current, pagination.pageSize);
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
        startProgress();
        router.push(`/product/${id}`);
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize
        });
    };

    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Title level={2}>Welcome to EMTSHOP</Title>
                </Col>
                <Col span={24}>
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={2}>Restaurant List</Title>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <Input
                                placeholder="Search restaurants..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: '300px' }}
                            />
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: '200px' }}
                            >
                                <Option value="popular">Popular</Option>
                                <Option value="rating">Rating</Option>
                            </Select>
                        </div>
                    </div>

                    <Row gutter={[16, 16]}>
                        {restaurants.map((restaurant) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={restaurant._id}>
                                <div onClick={() => handleCardClick(restaurant._id)} style={{ cursor: 'pointer' }}>
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

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
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