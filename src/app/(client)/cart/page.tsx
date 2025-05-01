import React from 'react';
import HomeLayout from '@/components/home/HomeLayout';
import CartClient from '@/components/cart/CartClient';

export default function CartPage() {
    return (
        <HomeLayout>
            <CartClient />
        </HomeLayout>
    );
} 