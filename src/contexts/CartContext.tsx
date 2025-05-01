'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { CartItem } from '@/types/cart';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'emtshop_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = useCallback((item: CartItem) => {
        console.log("Adding item to cart:", item); // Debug log
        setCartItems(prev => {
            const existingItem = prev.find(i =>
                i.id === item.id &&
                JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
            );

            if (existingItem) {
                const updatedItems = prev.map(i =>
                    i.id === item.id &&
                        JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
                console.log("Updated cart items:", updatedItems); // Debug log
                return updatedItems;
            }

            const newItems = [...prev, item];
            console.log("New cart items:", newItems); // Debug log
            return newItems;
        });

        message.success('Đã thêm vào giỏ hàng');
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        message.success('Đã xóa khỏi giỏ hàng');
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, []);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    console.log("Current cart state:", cartItems); // Debug log

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 