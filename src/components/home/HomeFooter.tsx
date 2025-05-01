import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { FacebookFilled, InstagramFilled, TwitterCircleFilled, YoutubeFilled, EnvironmentFilled, PhoneFilled, MailFilled } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const HomeFooter: React.FC = () => {
    return (
        <Footer className="!bg-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto">
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Title level={3} className="!text-[#ee4d2d] !mb-6">EMTSHOP</Title>
                        <Space direction="vertical" size="small">
                            <Text className="text-gray-600 flex items-center gap-2">
                                <EnvironmentFilled /> Thượng Thôn, Yên Phong, Bắc Ninh
                            </Text>
                            <Text className="text-gray-600 flex items-center gap-2">
                                <PhoneFilled /> 0123 456 789
                            </Text>
                            <Text className="text-gray-600 flex items-center gap-2">
                                <MailFilled /> hungphammanh777@gmail.com
                            </Text>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Title level={4} className="!text-gray-800 !mb-6">Về chúng tôi</Title>
                        <Space direction="vertical" size="small">
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Giới thiệu</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Tin tức</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Tuyển dụng</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Liên hệ</Link>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Title level={4} className="!text-gray-800 !mb-6">Hỗ trợ</Title>
                        <Space direction="vertical" size="small">
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Hướng dẫn đặt hàng</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Phương thức thanh toán</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Chính sách giao hàng</Link>
                            <Link className="text-gray-600 hover:text-[#ee4d2d]">Điều khoản dịch vụ</Link>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Title level={4} className="!text-gray-800 !mb-6">Theo dõi chúng tôi</Title>
                        <Space size="middle">
                            <Link className="text-[#1877f2] hover:opacity-80 text-2xl">
                                <FacebookFilled />
                            </Link>
                            <Link className="text-[#e4405f] hover:opacity-80 text-2xl">
                                <InstagramFilled />
                            </Link>
                            <Link className="text-[#1da1f2] hover:opacity-80 text-2xl">
                                <TwitterCircleFilled />
                            </Link>
                            <Link className="text-[#ff0000] hover:opacity-80 text-2xl">
                                <YoutubeFilled />
                            </Link>
                        </Space>
                    </Col>
                </Row>

                <Divider className="!bg-gray-200 !mt-12 !mb-8" />

                <div className="text-center text-gray-500">
                    <Text>© 2024 EMTSHOP. Tất cả các quyền được bảo lưu.</Text>
                </div>
            </div>
        </Footer>
    );
};

export default HomeFooter; 