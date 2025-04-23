'use client';
import React, { useState } from 'react';
import { Row, Col, Input, Select, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import HomeCard from '@/components/home/HomeCard';

const { Title } = Typography;
const { Option } = Select;

const HomePage = () => {
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('popular');

    // Dummy data for food items
    const foodItems = [
        {
            id: '1',
            name: 'Pizza Margherita',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
            rating: 4.5
        },
        {
            id: '2',
            name: 'Burger Deluxe',
            description: 'Beef patty with cheese, lettuce, and special sauce',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
            rating: 4.2
        },
        {
            id: '3',
            name: 'Sushi Platter',
            description: 'Assorted sushi with wasabi and soy sauce',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
            rating: 4.8
        },
        {
            id: '4',
            name: 'Pasta Carbonara',
            description: 'Spaghetti with creamy sauce, bacon, and parmesan',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
            rating: 4.3
        },
        {
            id: '5',
            name: 'Chicken Curry',
            description: 'Tender chicken in rich curry sauce with basmati rice',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
            rating: 4.6
        },
        {
            id: '6',
            name: 'Seafood Paella',
            description: 'Spanish rice dish with mixed seafood and saffron',
            price: 22.99,
            image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a',
            rating: 4.7
        },
        {
            id: '7',
            name: 'Vegetarian Bowl',
            description: 'Fresh mixed vegetables, quinoa, and tahini dressing',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
            rating: 4.4
        },
        {
            id: '8',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
            rating: 4.9
        }
    ];

    const handleAddToCart = (id: string) => {
        message.success('Added to cart!');
        // Implement add to cart functionality here
    };

    return (
        <HomeLayout>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>Our Menu</Title>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <Input
                        placeholder="Search food..."
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
                        <Option value="price-low">Price: Low to High</Option>
                        <Option value="price-high">Price: High to Low</Option>
                        <Option value="rating">Rating</Option>
                    </Select>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {foodItems.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <HomeCard
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            rating={item.rating}
                            onAddToCart={handleAddToCart}
                        />
                    </Col>
                ))}
            </Row>
        </HomeLayout>
    );
};

export default HomePage; 