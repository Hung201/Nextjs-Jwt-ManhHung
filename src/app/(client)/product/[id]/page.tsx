'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Row, Col, Typography, Button, Rate, Card, Divider, Image, List, Tag, message, Badge } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import { doneProgress } from '@/utils/nprogress';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
    const params = useParams();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        doneProgress();
    }, []);

    // Dữ liệu mẫu cho món ăn chi tiết (dựa trên schema đã cung cấp)
    const product = {
        id: '1',
        menu_id: '1',
        title: 'Trà Sữa Mộc - Thanh Đa',
        description: 'Trà sữa thơm ngon với nhiều topping hấp dẫn, được pha chế từ nguyên liệu tự nhiên',
        base_price: 35000,
        images: [
            'https://images.unsplash.com/photo-1527006686189-6b6b86f7d1b1',
            'https://images.unsplash.com/photo-1558857563-b371033873b8',
            'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf',
        ],
        rating: 4.5,
        total_reviews: '999+',
        opening_hours: '09:00 - 22:00',
        price_range: '15.000 - 35.000',
        restaurant: {
            name: 'Trà Sữa Mộc - Thanh Đa',
            address: '16 Thanh Đa, P. 27, Bình Thạnh, TP. HCM',
            phone: '1900 1234',
            email: 'contact@trasuamoc.com',
            rating: 4.5,
            delivery_time: '15-30 phút'
        },
        options: [
            {
                id: '1',
                title: 'Trân châu đen',
                additional_price: 5000,
                optional_description: 'Trân châu đen dẻo thơm'
            },
            {
                id: '2',
                title: 'Thạch trái cây',
                additional_price: 7000,
                optional_description: 'Thạch trái cây tự nhiên'
            },
            {
                id: '3',
                title: 'Pudding',
                additional_price: 8000,
                optional_description: 'Pudding mềm mịn'
            },
            {
                id: '4',
                title: 'Size L',
                additional_price: 10000,
                optional_description: 'Tăng size lớn'
            }
        ],
        reviews: [
            {
                id: '1',
                user_name: 'Nguyễn Văn A',
                rating: 5,
                comment: 'Trà sữa ngon, topping nhiều, giao hàng nhanh',
                image: 'https://images.unsplash.com/photo-1527006686189-6b6b86f7d1b1',
                created_at: '2024-02-20'
            },
            {
                id: '2',
                user_name: 'Trần Thị B',
                rating: 4,
                comment: 'Đồ uống ngon, nhưng giao hơi lâu',
                created_at: '2024-02-19'
            }
        ]
    };

    const handleOptionChange = (optionId: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            }
            return [...prev, optionId];
        });
    };

    const calculateTotalPrice = () => {
        const basePrice = product.base_price;
        const optionsPrice = selectedOptions.reduce((total, optionId) => {
            const option = product.options.find(opt => opt.id === optionId);
            return total + (option?.additional_price || 0);
        }, 0);
        return basePrice + optionsPrice;
    };

    const handleAddToCart = () => {
        message.success('Đã thêm vào giỏ hàng!');
    };

    return (
        <HomeLayout>
            <Card className="product-detail-card">
                <Row gutter={[32, 32]}>
                    {/* Phần hình ảnh sản phẩm */}
                    <Col xs={24} md={12}>
                        <Image.PreviewGroup>
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </Col>
                                {product.images.slice(1).map((image, index) => (
                                    <Col span={12} key={index}>
                                        <Image
                                            src={image}
                                            alt={`${product.title} ${index + 2}`}
                                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Image.PreviewGroup>
                    </Col>

                    {/* Phần thông tin sản phẩm */}
                    <Col xs={24} md={12}>
                        <div className="product-info">
                            <Badge.Ribbon text="CAFÉ/DESSERT" color="blue">
                                <Title level={2}>{product.title}</Title>
                            </Badge.Ribbon>

                            <div style={{ marginTop: '16px' }}>
                                <Rate disabled defaultValue={product.rating} />
                                <Text strong style={{ marginLeft: '8px' }}>
                                    {product.total_reviews} đánh giá trên ShopeeFood
                                </Text>
                            </div>

                            <Paragraph style={{ marginTop: '16px' }}>{product.description}</Paragraph>

                            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                                <Col span={12}>
                                    <ClockCircleOutlined /> <Text strong>Giờ mở cửa:</Text>
                                    <br />
                                    <Text>{product.opening_hours}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Khoảng giá:</Text>
                                    <br />
                                    <Text>{product.price_range}đ</Text>
                                </Col>
                            </Row>

                            <Divider />

                            {/* Phần tùy chọn thêm */}
                            <Title level={4}>Tùy chọn thêm:</Title>
                            <List
                                dataSource={product.options}
                                renderItem={option => (
                                    <List.Item>
                                        <Row style={{ width: '100%' }} justify="space-between" align="middle">
                                            <Col>
                                                <Text>{option.title}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {option.optional_description}
                                                </Text>
                                            </Col>
                                            <Col>
                                                <Button
                                                    type={selectedOptions.includes(option.id) ? 'primary' : 'default'}
                                                    onClick={() => handleOptionChange(option.id)}
                                                >
                                                    +{option.additional_price.toLocaleString()}đ
                                                </Button>
                                            </Col>
                                        </Row>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            {/* Phần thông tin nhà hàng */}
                            <Title level={4}>Thông tin cửa hàng:</Title>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>{product.restaurant.name}</Text>
                                <br />
                                <Text><EnvironmentOutlined /> {product.restaurant.address}</Text>
                                <br />
                                <Text><PhoneOutlined /> {product.restaurant.phone}</Text>
                            </div>

                            {/* Phần đánh giá */}
                            <Title level={4}>Đánh giá từ khách hàng:</Title>
                            <List
                                dataSource={product.reviews}
                                renderItem={review => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div>
                                                    <Text strong>{review.user_name}</Text>
                                                    <Rate disabled defaultValue={review.rating} style={{ fontSize: '14px', marginLeft: '8px' }} />
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <Text>{review.comment}</Text>
                                                    {review.image && (
                                                        <Image
                                                            src={review.image}
                                                            alt="Review"
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                    <br />
                                                    <Text type="secondary">{review.created_at}</Text>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            {/* Phần giá và nút thêm vào giỏ hàng */}
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

export default ProductDetail; 