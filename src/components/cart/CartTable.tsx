'use client';

import React from 'react';
import { Table, Button, InputNumber, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '@/types/cart';

const { Text } = Typography;

interface CartTableProps {
    cartItems: CartItem[];
    onQuantityChange: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({
    cartItems,
    onQuantityChange,
    onRemoveItem,
}) => {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: CartItem) => (
                <div className="flex items-center gap-3">
                    <img
                        src={record.image}
                        alt={text}
                        className="w-[50px] h-[50px] object-cover rounded"
                    />
                    <Text strong>{text}</Text>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()}đ`,
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (_: any, record: CartItem) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => onQuantityChange(record.id, value || 1)}
                    className="w-[70px]"
                />
            ),
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            render: (_: any, record: CartItem) => `${(record.price * record.quantity).toLocaleString()}đ`,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: CartItem) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveItem(record.id)}
                />
            ),
        },
    ];

    console.log("Cart Items in Table:", cartItems); // Debug log

    return (
        <Table
            columns={columns}
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            className="mb-6"
        />
    );
};

export default CartTable; 