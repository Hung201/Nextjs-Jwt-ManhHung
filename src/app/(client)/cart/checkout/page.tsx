import React from 'react';
import HomeLayout from '@/components/home/HomeLayout';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export default function CheckoutPage() {
    return (
        <HomeLayout>
            <CheckoutClient />
        </HomeLayout>
    );
}