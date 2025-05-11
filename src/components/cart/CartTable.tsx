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
                    <div className="flex flex-col">
                        <Text strong className="text-base">{record.name}</Text>
                        {record.selectedOptions ? (
                            <div className="text-xs text-gray-500 mt-1">
                                {Object.entries(record.selectedOptions)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]) => value)
                                    .map(option => `+ ${option}`)
                                    .join(', ')}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500 mt-1">Mặc định</div>
                        )}
                    </div>
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

    // Chỉ lấy thông tin cần thiết và loại bỏ ID khỏi hiển thị
    const dataWithKeys = cartItems.map((item, index) => {
        const { id, name, price, quantity, image, selectedOptions, restaurant_id } = item;
        return {
            id,
            name,
            price,
            quantity,
            image,
            selectedOptions,
            restaurant_id,
            uniqueKey: `${id}-${index}`
        };
    });

    return (
        <Table
            columns={columns}
            dataSource={dataWithKeys}
            rowKey="uniqueKey"
            pagination={false}
            className="mb-6"
        />
    );
};

export default CartTable; 