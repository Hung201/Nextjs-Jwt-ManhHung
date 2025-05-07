'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Card, Divider, List, message } from 'antd';
import { HeartOutlined, ShareAltOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import ProductOptionsModal from './ProductOptionsModal';
import { doneProgress } from '@/utils/nprogress';
import { useCart } from '@/contexts/CartContext';
import dynamic from 'next/dynamic';

const { Title, Text, Paragraph } = Typography;

// Dynamically import components that might cause hydration issues
const Image = dynamic(() => import('antd').then(mod => mod.Image), { ssr: false });
const Rate = dynamic(() => import('antd').then(mod => mod.Rate), { ssr: false });

const ProductDetailClient = ({ data }: { data: any }) => {
    console.log('>>> check restaurant data:', data);
    if (!data) return <div>Không có dữ liệu sản phẩm!</div>;
    const [activeSection, setActiveSection] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { addToCart } = useCart();
    const restaurant = data;
    const menus = restaurant.menus || [];

    // Log menu items and their options
    useEffect(() => {
        menus.forEach((menu: any) => {
            console.log('Menu:', menu.title);
            menu.items?.forEach((item: any) => {
                console.log('Item:', item.title);
                console.log('Item Options:', item.options);
            });
        });
    }, [menus]);

    // Debounce scroll handling
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const scrollPosition = window.scrollY + 100;
                menus.forEach((menu: any) => {
                    const element = document.getElementById(menu._id);
                    if (element) {
                        const { top, bottom } = element.getBoundingClientRect();
                        if (top <= 100 && bottom >= 100) {
                            setActiveSection(menu._id);
                        }
                    }
                });
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [menus]);

    const handleMenuClick = (menuId: string) => {
        const element = document.getElementById(menuId);
        if (element) {
            const offset = -80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset + offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(menuId);
        }
    };

    const getImageSrc = (img: string) => {
        if (!img || img.trim() === '') return '/no-image.png';
        if (img.startsWith('data:image')) return img;
        return `http://localhost:8080/uploads/${img}`;
    };

    const handleAddToCart = (item: any) => {
        if (item.options && item.options.length > 0) {
            setSelectedItem({ ...item, restaurant_id: restaurant._id || restaurant.id, restaurant });
            setIsModalOpen(true);
        } else {
            console.log('DEBUG restaurant:', restaurant);
            console.log('DEBUG restaurant._id:', restaurant._id);
            const cartItem = {
                id: item._id,
                name: item.title,
                price: item.base_price,
                quantity: 1,
                image: getImageSrc(item.image),
                restaurant_id: restaurant._id || restaurant.id,
                selectedOptions: {}
            };
            console.log('addToCart ProductDetailClient', cartItem);
            addToCart(cartItem);
        }
    };

    return (
        <HomeLayout>
            <div className="flex flex-col max-w-7xl mx-auto my-8 gap-8 bg-[#f2f2f2] p-8 min-h-screen">
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <div className="w-full h-[400px] relative">
                                <img
                                    src={getImageSrc(restaurant.image)}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="p-4">
                                <Title level={2} className="text-2xl font-bold mb-4">{restaurant.name}</Title>
                                <div className="flex items-center mb-4">
                                    <Rate disabled defaultValue={restaurant.rating} />
                                    <Text strong className="ml-2">{restaurant.rating} sao</Text>
                                </div>
                                <Paragraph className="text-gray-600 mb-6">{restaurant.description}</Paragraph>
                                <Divider />
                                <Title level={4} className="text-lg font-semibold mb-4">Thông tin cửa hàng:</Title>
                                <div className="space-y-2">
                                    <Text strong className="block">{restaurant.name}</Text>
                                    <Text className="flex items-center gap-2">
                                        <EnvironmentOutlined /> {restaurant.address}
                                    </Text>
                                    <Text className="flex items-center gap-2">
                                        <PhoneOutlined /> {restaurant.phone}
                                    </Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <ProductOptionsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedItem={selectedItem}
                />

                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <div className="w-full bg-white rounded-xl p-6">
                        <div className="text-xl font-bold text-[#ee4d2d] mb-6 text-center tracking-wide">THỰC ĐƠN</div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 w-full">
                                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2 md:sticky md:top-20">
                                    {menus.map((menu: any) => (
                                        <button
                                            key={menu._id}
                                            className={`menu-button transition px-4 py-2 rounded-lg font-semibold text-base text-left focus:outline-none border-none ${activeSection === menu._id ? 'bg-[#ee4d2d] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-[#fff1ef] hover:text-[#ee4d2d]'}`}
                                            onClick={() => handleMenuClick(menu._id)}
                                        >
                                            {menu.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:w-3/4 w-full">
                                <div className="bg-white p-4">
                                    {menus.map((menu: any, index: number) => (
                                        <React.Fragment key={menu._id}>
                                            <div id={menu._id} className="menu-section scroll-mt-20">
                                                <div className="font-bold text-lg mb-4 uppercase text-[#ee4d2d] tracking-wide">{menu.title}</div>
                                                {menu.items?.length > 0 ? (
                                                    <ul className="divide-y divide-gray-100">
                                                        {menu.items.map((item: any) => (
                                                            <li key={item._id} className="menu-item flex items-center gap-4 py-4 px-2 hover:bg-white rounded-lg transition-all">
                                                                <img src={getImageSrc(item.image)} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-semibold text-base truncate">{item.title}</div>
                                                                    {item.description && <div className="text-gray-400 text-xs truncate">{item.description}</div>}
                                                                </div>
                                                                <div className="text-[#ee4d2d] font-bold text-base min-w-[70px] text-right">{item.base_price?.toLocaleString()}<sup className="text-xs">đ</sup></div>
                                                                <button
                                                                    onClick={() => handleAddToCart(item)}
                                                                    className="ml-2 bg-[#FF4D4F] hover:bg-[#FF7875] shadow text-white rounded-full w-8 h-8 flex items-center justify-center text-xl transition-all hover:scale-105 border-none focus:outline-none"
                                                                >
                                                                    <span className="pb-0.5">+</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="text-gray-400 italic">Không có món nào</div>
                                                )}
                                            </div>
                                            {index < menus.length - 1 && (
                                                <Divider className="!my-8 !border-gray-300" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </HomeLayout>
    );
};

export default ProductDetailClient; 