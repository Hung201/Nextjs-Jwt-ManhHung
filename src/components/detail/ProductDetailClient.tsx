'use client';
import React, { useState } from 'react';
import { Row, Col, Typography, Button, Rate, Card, Divider, Image, List, Badge, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import { doneProgress } from '@/utils/nprogress';

const { Title, Text, Paragraph } = Typography;

const ProductDetailClient = ({ data }: { data: any }) => {
    console.log('ProductDetailClient data:', data);
    if (!data) return <div>Không có dữ liệu sản phẩm!</div>;
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const restaurant = data;
    const menu = restaurant.menus?.[0];
    const item = menu?.items?.[0];

    const handleOptionChange = (optionId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
        );
    };

    const calculateTotalPrice = () => {
        const basePrice = item?.base_price || 0;
        const optionsPrice = selectedOptions.reduce((total, optionId) => {
            const option = item?.options?.find((opt: any) => opt._id === optionId);
            return total + (option?.additional_price || 0);
        }, 0);
        return basePrice + optionsPrice;
    };

    const handleAddToCart = () => {
        message.success('Đã thêm vào giỏ hàng!');
    };

    if (!item) return <div>Không có sản phẩm!</div>;

    // Xử lý image base64 hoặc tên file
    const getImageSrc = (img: string) => {
        if (!img || img.trim() === '') return '/no-image.png';
        if (img.startsWith('data:image')) return img;
        // Nếu là tên file, trả về đúng đường dẫn ảnh trên server
        return `http://localhost:8080/uploads/${img}`;
    };

    console.log('item.image:', item);
    console.log('getImageSrc(item.image):', getImageSrc(item.image));

    return (
        <HomeLayout>
            <Card className="product-detail-card" style={{ maxWidth: 900, margin: '32px auto' }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Image
                            src={getImageSrc(restaurant.image)}
                            alt={restaurant.name}
                            style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8 }}
                            fallback="/no-image.png"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="product-info">
                            <Title level={2}>{restaurant.name}</Title>
                            <Rate disabled defaultValue={restaurant.rating} />
                            <Text strong style={{ marginLeft: 8 }}>{restaurant.rating} sao</Text>
                            <Paragraph style={{ marginTop: 16 }}>{restaurant.description}</Paragraph>
                            <Divider />
                            <Title level={4}>Tùy chọn thêm: </Title>
                            <Divider />
                            <Title level={4}>Thông tin cửa hàng:</Title>
                            <Text strong>{restaurant.name}</Text><br />
                            <Text><EnvironmentOutlined /> {restaurant.address}</Text><br />
                            <Text><PhoneOutlined /> {restaurant.phone}</Text>
                            <Divider />
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {calculateTotalPrice().toLocaleString()}đ
                                    </Title>
                                </Col>
                                <Col>
                                    <Button type="text" icon={<HeartOutlined />} size="large" />
                                    <Button type="text" icon={<ShareAltOutlined />} size="large" />
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
        </HomeLayout>
    );
};

export default ProductDetailClient; 