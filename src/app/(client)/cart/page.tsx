'use client';
import React, { useState } from 'react';
import { Table, Button, InputNumber, Typography, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';

const { Title, Text } = Typography;

// Mock cart data
const mockCartItems = [
    {
        id: '1',
        name: 'Classic Burger',
        price: 12.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: '2',
        name: 'Margherita Pizza',
        price: 14.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState(mockCartItems);

    const handleQuantityChange = (id: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        message.success('Item removed from cart');
    };

    const columns = [
        {
            title: 'Item',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={record.image}
                        alt={text}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <Text strong>{text}</Text>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (_: any, record: any) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.id, value || 1)}
                />
            ),
        },
        {
            title: 'Total',
            key: 'total',
            render: (_: any, record: any) => `$${(record.price * record.quantity).toFixed(2)}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                />
            ),
        },
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <HomeLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
                    Your Cart
                </Title>

                {cartItems.length > 0 ? (
                    <>
                        <Table
                            columns={columns}
                            dataSource={cartItems}
                            rowKey="id"
                            pagination={false}
                            style={{ marginBottom: '24px' }}
                        />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '24px',
                            background: '#f5f5f5',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '18px' }}>
                                Total: ${totalAmount.toFixed(2)}
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingOutlined />}
                                style={{
                                    background: '#000',
                                    borderColor: '#000'
                                }}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                ) : (
                    <Empty
                        description="Your cart is empty"
                        style={{ margin: '48px 0' }}
                    />
                )}
            </div>
        </HomeLayout>
    );
};

export default CartPage; 