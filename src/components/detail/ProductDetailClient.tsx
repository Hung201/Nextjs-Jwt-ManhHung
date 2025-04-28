'use client';
import React, { useState } from 'react';
import { Row, Col, Typography, Button, Rate, Card, Divider, Image, List, Badge, message } from 'antd';
import { HeartOutlined, ShareAltOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import HomeLayout from '@/components/home/HomeLayout';
import { doneProgress } from '@/utils/nprogress';

const { Title, Text, Paragraph } = Typography;

const ProductDetailClient = ({ data }: { data: any }) => {
    console.log('ProductDetailClient data:', data);
    if (!data) return <div>Không có dữ liệu sản phẩm!</div>;
    const [selectedMenu, setSelectedMenu] = useState(0);
    const restaurant = data;
    const menus = restaurant.menus || [];
    const menu = menus[selectedMenu];
    const item = menu?.items?.[0];

    const handleMenuClick = (idx: number) => setSelectedMenu(idx);

    if (!item) return <div>Không có sản phẩm!</div>;

    // Xử lý image base64 hoặc tên file
    const getImageSrc = (img: string) => {
        if (!img || img.trim() === '') return '/no-image.png';
        if (img.startsWith('data:image')) return img;
        // Nếu là tên file, trả về đúng đường dẫn ảnh trên server
        return `http://localhost:8080/uploads/${img}`;
    };

    console.log('item.image:', item);
    console.log('getImageSrc(item.image):', getImageSrc(item.image));

    return (
        <HomeLayout>
            <div className="flex flex-col max-w-4xl mx-auto my-8 gap-8">
                {/* Product Detail */}
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <Image
                                src={getImageSrc(restaurant.image)}
                                alt={restaurant.name}
                                className="w-full h-[400px] object-cover rounded-lg"
                                fallback="/no-image.png"
                            />
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
                {/* Menu Section Below */}
                <div className="w-full bg-gray-50 rounded-xl p-6 mt-8 shadow-sm">
                    <div className="text-xl font-bold text-red-600 mb-6 text-center tracking-wide">THỰC ĐƠN</div>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Menu categories */}
                        <div className="md:w-1/4 w-full mb-4 md:mb-0">
                            <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                                {menus.map((menu: any, idx: number) => (
                                    <button
                                        key={menu._id || idx}
                                        className={`transition px-4 py-2 rounded-lg font-semibold text-base text-left focus:outline-none border-none ${selectedMenu === idx ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'}`}
                                        onClick={() => handleMenuClick(idx)}
                                    >
                                        {menu.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Center: Menu items */}
                        <div className="md:w-2/4 w-full">
                            <div className="bg-white rounded-2xl shadow p-4">
                                <div className="font-bold text-lg mb-4 uppercase text-red-500 tracking-wide">{menu?.title}</div>
                                {menu?.items?.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {menu.items.map((item: any) => (
                                            <li key={item._id} className="flex items-center gap-4 py-4">
                                                <img src={getImageSrc(item.image)} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-base truncate">{item.name}</div>
                                                    {item.description && <div className="text-gray-400 text-xs truncate">{item.description}</div>}
                                                </div>
                                                <div className="text-blue-500 font-bold text-base min-w-[70px] text-right">{item.base_price?.toLocaleString()}<span className="text-xs align-super">đ</span></div>
                                                <button className="ml-2 bg-red-500 hover:bg-red-600 shadow text-white rounded-full w-8 h-8 flex items-center justify-center text-xl transition"><span className="pb-0.5">+</span></button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-400 italic">Không có món nào</div>
                                )}
                            </div>
                        </div>
                        {/* Right: Placeholder for QR code or other content */}
                        {/* <div className="md:w-1/4 w-full">QR code here</div> */}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default ProductDetailClient; 