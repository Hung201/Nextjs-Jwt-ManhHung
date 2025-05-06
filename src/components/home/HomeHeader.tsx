'use client';
import React, { useState, useMemo } from 'react';
import { Layout, Typography, Button, Input, Dropdown, Space } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { navigateWithProgress } from '@/utils/nprogress';
import { useCart } from '@/contexts/CartContext';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

// Dynamically import Badge with no SSR
const Badge = dynamic(() => import('antd').then(mod => mod.Badge), {
    ssr: false,
    loading: () => null // Add loading state to prevent layout shift
});

const HomeHeader: React.FC = () => {
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState('vi');
    const { cartItems } = useCart();
    const { data: session } = useSession();

    // Memoize cartItemCount calculation
    const cartItemCount = useMemo(() =>
        cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]
    );

    // Debounce navigation to prevent rapid clicks
    const handleNavigation = (href: string) => {
        navigateWithProgress(() => {
            router.push(href);
        });
    };

    const handleSearch = (value: string) => {
        console.log('Search:', value);
        // Implement search functionality here
    };

    const languageItems = [
        {
            key: 'vi',
            label: (
                <span className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
                    <span>Tiếng Việt</span>
                </span>
            )
        },
        {
            key: 'en',
            label: (
                <span className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
                    <span>English</span>
                </span>
            )
        }
    ];

    const handleLanguageChange = (key: string) => {
        setCurrentLang(key);
        // Implement language change functionality here
    };

    const iconStyle = { color: '#333333', fontSize: '24px' };
    const cartIconStyle = { color: '#333333', fontSize: '28px' };

    const user = session?.user;
    const isCustomer = user && user.role === 'CUSTOMER';

    const customerMenu = {
        items: [
            {
                key: 'signout',
                danger: true,
                label: <span onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sign out</span>,
            },
        ],
    };

    return (
        <Header className="flex items-center justify-between px-6 shadow-lg sticky top-0 z-50 h-16 bg-white [&.ant-layout-header]:!bg-white">
            <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        onClick={() => handleNavigation('/')}
                        className="flex items-center cursor-pointer hover:opacity-80 transition-all min-w-[140px]"
                    >
                        <Title level={3} className="!m-0 !text-[#ee4d2d] font-bold tracking-wide">EMTSHOP</Title>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <Dropdown
                        menu={{
                            items: languageItems,
                            onClick: ({ key }) => handleLanguageChange(key),
                            selectedKeys: [currentLang],
                            className: "bg-white border border-gray-200"
                        }}
                        placement="bottomRight"
                        className="flex items-center hover:bg-[#d73211] rounded-full transition-all"
                    >
                        <Button
                            type="text"
                            className="flex items-center justify-center text-[#333333] hover:text-white h-10 px-4"
                            icon={<GlobalOutlined style={iconStyle} />}
                        >
                            <span className="ml-1">{currentLang.toUpperCase()}</span>
                        </Button>
                    </Dropdown>
                    {isCustomer ? (
                        <Dropdown menu={customerMenu} placement="bottomRight">
                            <a onClick={e => e.preventDefault()} className="font-semibold text-[#333] px-4 cursor-pointer select-none">
                                <Space>
                                    Welcome, {user.name}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    ) : (
                        <Button
                            onClick={() => handleNavigation('/auth/login')}
                            type="text"
                            className="flex items-center justify-center text-[#333333] hover:text-white hover:bg-[#d73211] transition-all h-10 w-10 rounded-full"
                            icon={<UserOutlined style={iconStyle} />}
                        />
                    )}
                    <Button
                        onClick={() => handleNavigation('/cart')}
                        type="text"
                        className="flex items-center justify-center text-[#333333] hover:text-white hover:bg-[#d73211] transition-all h-10 w-10 rounded-full"
                    >
                        <Badge
                            count={cartItemCount}
                            size="small"
                            showZero={false}
                            offset={[-2, 2]}
                            className="flex items-center [&_.ant-badge-count]:!bg-[#ee4d2d] [&_.ant-badge-count]:!text-white"
                        >
                            <ShoppingCartOutlined style={cartIconStyle} />
                        </Badge>
                    </Button>
                </div>
            </div>
        </Header>
    );
};

export default HomeHeader; 