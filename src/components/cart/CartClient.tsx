'use client';

import React from 'react';
import { Typography, Empty, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import CartTable from './CartTable';
import CartSummary from './CartSummary';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const buttonStyle = {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    color: 'white'
};

const CartClient = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    const handleQuantityChange = (id: string, quantity: number) => {
        updateQuantity(id, quantity);
    };

    const handleRemoveItem = (id: string) => {
        removeFromCart(id);
    };

    const handleCheckout = () => {
        router.push('/cart/checkout');
    };

    const handleContinueShopping = () => {
        router.back();
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-[1000px] mx-auto">
            <Title level={2} className="text-center mb-8">
                Giỏ hàng của bạn
            </Title>

            {cartItems.length > 0 ? (
                <>
                    <CartTable
                        cartItems={cartItems}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                    />
                    <CartSummary
                        totalAmount={totalAmount}
                        onCheckout={handleCheckout}
                    />
                </>
            ) : (
                <div className="text-center">
                    <Empty
                        description="Giỏ hàng của bạn đang trống"
                        className="my-12"
                    />
                    <Button
                        icon={<ShoppingOutlined />}
                        onClick={handleContinueShopping}
                        className="!bg-[#ee4d2d] !border-[#ee4d2d] !text-white hover:!bg-[#d73211] hover:!border-[#d73211] hover:!opacity-90"
                    >
                        Tiếp tục mua hàng
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CartClient;