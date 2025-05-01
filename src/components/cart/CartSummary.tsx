'use client';

import React from 'react';
import { Button, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface CartSummaryProps {
    totalAmount: number;
    onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    totalAmount,
    onCheckout,
}) => {
    const router = useRouter();

    const handleContinueShopping = () => {
        router.back();
    };

    return (
        <div className="flex justify-between items-center p-6 bg-gray-100 rounded-lg">
            <Text strong className="text-lg">
                Tổng tiền: {totalAmount.toLocaleString()}đ
            </Text>
            <div className="flex gap-4">
                <Button
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={handleContinueShopping}
                    className="!bg-white !border-[#ee4d2d] !text-[#ee4d2d] hover:!bg-[#fef6f5] hover:!border-[#ee4d2d] hover:!text-[#ee4d2d]"
                >
                    Tiếp tục mua hàng
                </Button>
                <Button
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={onCheckout}
                    className="!bg-[#ee4d2d] !border-[#ee4d2d] !text-white hover:!bg-[#d73211] hover:!border-[#d73211] hover:!opacity-90"
                >
                    Thanh toán
                </Button>
            </div>
        </div>
    );
};

export default CartSummary; 