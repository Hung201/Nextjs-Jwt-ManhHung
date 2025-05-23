import React from 'react';
import HomeLayout from '@/components/home/HomeLayout';
import CartClient from '@/components/cart/CartClient';

const CartPage = () => {
    return (
        <HomeLayout>
            <CartClient />
        </HomeLayout>
    );
}

export default CartPage;