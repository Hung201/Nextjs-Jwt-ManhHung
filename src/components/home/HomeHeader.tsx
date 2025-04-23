'use client';
import React, { useState } from 'react';
import { Layout, Typography, Button, Badge, Input, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { startProgress, doneProgress } from '@/utils/nprogress';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const HomeHeader: React.FC = () => {
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState('vi');

    const handleNavigation = (href: string) => {
        startProgress();
        router.push(href);
        setTimeout(doneProgress, 500);
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

    const iconStyle = { color: '#fff', fontSize: '24px' };
    const cartIconStyle = { color: '#fff', fontSize: '28px' };

    return (
        <Header className="flex items-center justify-between px-6 shadow-lg sticky top-0 z-50 h-16" style={{ background: '#2162a0' }}>
            <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div
                        onClick={() => handleNavigation('/')}
                        className="flex items-center cursor-pointer hover:opacity-80 transition-all min-w-[140px]"
                    >
                        <Title level={3} className="!m-0 !text-white font-bold tracking-wide">EMTSHOP</Title>
                    </div>

                    <div className="flex items-center">
                        <Search
                            placeholder="Search..."
                            onSearch={handleSearch}
                            className="w-[400px] [&_.ant-input-group-addon]:!bg-white [&_.ant-input-group-addon]:last:!border-0 [&_.ant-input-search-button]:!border-0"
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden'
                            }}
                            size="large"
                            allowClear
                            enterButton={
                                <Button
                                    style={{
                                        background: 'white',
                                        border: 'none',
                                        boxShadow: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '100%',
                                        padding: 0,
                                        margin: 0
                                    }}
                                >
                                    <SearchOutlined style={{ fontSize: '20px', color: '#2162a0' }} />
                                </Button>
                            }
                            rootClassName="[&_.ant-input-group]:[border:none] [&_.ant-input]:!border-0 [&_.ant-input-group-addon]:!p-0"
                        />
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
                        className="flex items-center hover:bg-blue-700 rounded-full transition-all"
                    >
                        <Button
                            type="text"
                            className="flex items-center justify-center text-white hover:text-white h-10 px-4"
                            icon={<GlobalOutlined style={iconStyle} />}
                        >
                            <span className="ml-1 text-white">{currentLang.toUpperCase()}</span>
                        </Button>
                    </Dropdown>
                    <Button
                        onClick={() => handleNavigation('/profile')}
                        type="text"
                        className="flex items-center justify-center text-white hover:text-white hover:bg-blue-700 transition-all h-10 w-10"
                        icon={<UserOutlined style={iconStyle} />}
                    />
                    <Button
                        onClick={() => handleNavigation('/cart')}
                        type="text"
                        className="flex items-center justify-center text-white hover:text-white hover:bg-blue-700 transition-all h-10 w-10"
                    >
                        <Badge
                            count={0}
                            size="small"
                            className="flex items-center [&_.ant-badge-count]:!bg-blue-500"
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