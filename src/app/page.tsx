'use client';
import React, { useState } from 'react';
import { Row, Col, Input, Select, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import HomeCard from '@/components/home/HomeCard';
import { useRouter } from 'next/navigation';
import { startProgress } from '@/utils/nprogress';

const { Title } = Typography;
const { Option } = Select;

const HomePage = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('popular');

    // Dữ liệu mẫu cho nhà hàng
    const restaurants = [
        {
            id: '1',
            name: 'Phở 24',
            address: '123 Lê Lợi, Quận 1, TP.HCM',
            phone: '028.1234.5678',
            email: 'contact@pho24.com',
            rating: 4.5
        },
        {
            id: '2',
            name: 'Bếp Nhà Lê',
            address: '45 Nguyễn Huệ, Quận 1, TP.HCM',
            phone: '028.8765.4321',
            email: 'info@bepnhale.com',
            rating: 4.7
        }
    ];

    // Dữ liệu mẫu cho menu
    const menus = [
        {
            id: '1',
            restaurant_id: '1',
            title: 'Menu Phở',
            description: 'Các món phở truyền thống',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
        },
        {
            id: '2',
            restaurant_id: '2',
            title: 'Menu Cơm',
            description: 'Các món cơm gia đình',
            image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb'
        }
    ];

    // Dữ liệu mẫu cho các món ăn
    const menuItems = [
        {
            id: '1',
            menu_id: '1',
            title: 'Phở Bò Tái',
            description: 'Phở với thịt bò tái, nước dùng đậm đà',
            base_price: 65000,
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
        },
        {
            id: '2',
            menu_id: '1',
            title: 'Phở Gà',
            description: 'Phở với thịt gà ta, nước dùng thanh ngọt',
            base_price: 60000,
            image: 'https://images.unsplash.com/photo-1555126634-323283e090fa'
        },
        {
            id: '3',
            menu_id: '2',
            title: 'Cơm Sườn Nướng',
            description: 'Cơm với sườn nướng, trứng ốp la và rau xào',
            base_price: 55000,
            image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb'
        },
        {
            id: '4',
            menu_id: '2',
            title: 'Cơm Gà Xối Mỡ',
            description: 'Cơm với gà rán giòn, kèm kim chi và soup',
            base_price: 50000,
            image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92'
        }
    ];

    // Dữ liệu mẫu cho các tùy chọn món ăn
    const menuItemOptions = [
        {
            id: '1',
            menu_item_id: '1',
            title: 'Thêm thịt bò',
            additional_price: 20000,
            optional_description: 'Thêm 100g thịt bò tái'
        },
        {
            id: '2',
            menu_item_id: '1',
            title: 'Thêm bánh phở',
            additional_price: 10000,
            optional_description: 'Thêm 1 phần bánh phở'
        },
        {
            id: '3',
            menu_item_id: '3',
            title: 'Thêm sườn',
            additional_price: 25000,
            optional_description: 'Thêm 1 miếng sườn nướng'
        },
        {
            id: '4',
            menu_item_id: '4',
            title: 'Thêm cơm',
            additional_price: 10000,
            optional_description: 'Thêm 1 phần cơm'
        }
    ];

    const handleAddToCart = (id: string) => {
        message.success('Đã thêm vào giỏ hàng!');
    };

    // Lọc và sắp xếp các món ăn
    const filteredItems = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.base_price - b.base_price;
            case 'price-high':
                return b.base_price - a.base_price;
            default:
                return 0;
        }
    });

    const handleCardClick = (id: string) => {
        startProgress();
        router.push(`/product/${id}`);
    };

    return (
        <HomeLayout>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>Thực Đơn</Title>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <Input
                        placeholder="Tìm kiếm món ăn..."
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
                        <Option value="popular">Phổ biến</Option>
                        <Option value="price-low">Giá: Thấp đến Cao</Option>
                        <Option value="price-high">Giá: Cao đến Thấp</Option>
                    </Select>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {sortedItems.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <div onClick={() => handleCardClick(item.id)} style={{ cursor: 'pointer' }}>
                            <HomeCard
                                id={item.id}
                                name={item.title}
                                description={item.description}
                                price={item.base_price}
                                image={item.image}
                                rating={4.5}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </Col>
                ))}
            </Row>
        </HomeLayout>
    );
};

export default HomePage; 