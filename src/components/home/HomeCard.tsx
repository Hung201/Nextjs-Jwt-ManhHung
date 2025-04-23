'use client';
import React from 'react';
import { Card, Typography, Button, Rate, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HomeCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    onAddToCart: (id: string) => void;
}

const HomeCard: React.FC<HomeCardProps> = ({
    id,
    name,
    description,
    price,
    image,
    rating,
    onAddToCart
}) => {
    return (
        <Card
            hoverable
            cover={
                <div style={{
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5'
                }}>
                    <img
                        alt={name}
                        src={image}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            }
            style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Title level={4} style={{ margin: 0 }}>{name}</Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>{description}</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '16px' }}>${price.toFixed(2)}</Text>
                    <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: '14px' }} />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => onAddToCart(id)}
                    style={{
                        width: '100%',
                        background: '#000',
                        borderColor: '#000'
                    }}
                >
                    Add to Cart
                </Button>
            </Space>
        </Card>
    );
};

export default HomeCard; 