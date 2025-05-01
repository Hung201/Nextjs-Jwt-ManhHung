'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Divider, Radio, Modal, message } from 'antd';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
const { Title, Text } = Typography;
type PaymentMethod = 'COD' | 'BANKING';
interface CheckoutFormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
    paymentMethod: PaymentMethod;
}

const CheckoutClient = () => {
    const { cartItems, clearCart } = useCart();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const onFinish = (values: CheckoutFormData) => {
        if (values.paymentMethod === 'COD') {
            // Handle COD payment
            message.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
            clearCart();
            router.push('/');
        } else {
            // Show QR code modal for banking payment
            setIsModalVisible(true);
        }
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        message.success('Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin bên dưới.');
        clearCart();
        router.push('/');
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="max-w-[1000px] mx-auto py-8 px-4">
            <Title level={2} className="text-center mb-8">
                Thanh toán
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Delivery Information Form */}
                <div>
                    <Card className="mb-6">
                        <Title level={4} className="mb-6">Thông tin giao hàng</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={true}
                        >
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ tên' },
                                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Địa chỉ giao hàng"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ' },
                                    { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập địa chỉ giao hàng"
                                    rows={3}
                                />
                            </Form.Item>

                            <Form.Item
                                name="note"
                                label="Ghi chú"
                            >
                                <Input.TextArea
                                    placeholder="Nhập ghi chú (nếu có)"
                                    rows={3}
                                />
                            </Form.Item>

                            <Form.Item
                                name="paymentMethod"
                                label="Phương thức thanh toán"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                                initialValue="COD"
                            >
                                <Radio.Group>
                                    <div className="space-y-4">
                                        <Radio value="COD" className="w-full">
                                            <div className="flex flex-col">
                                                <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                                                <Text className="text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</Text>
                                            </div>
                                        </Radio>
                                        <Radio value="BANKING" className="w-full">
                                            <div className="flex flex-col">
                                                <Text strong>Chuyển khoản ngân hàng</Text>
                                                <Text className="text-gray-500">Chuyển khoản qua tài khoản ngân hàng</Text>
                                            </div>
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <Title level={4} className="mb-6">Thông tin đơn hàng</Title>

                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between mb-4">
                                <div className="flex gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <Text strong>{item.name}</Text>
                                        <div className="text-gray-500 text-sm">
                                            Số lượng: {item.quantity}
                                        </div>
                                        {item.selectedOptions && Object.values(item.selectedOptions).filter(Boolean).length > 0 && (
                                            <div className="text-gray-500 text-sm">
                                                {Object.values(item.selectedOptions).filter(Boolean).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Text strong>{(item.price * item.quantity).toLocaleString()}đ</Text>
                            </div>
                        ))}

                        <Divider />

                        <div className="flex justify-between mb-4">
                            <Text strong>Tổng tiền hàng:</Text>
                            <Text strong>{totalAmount.toLocaleString()}đ</Text>
                        </div>

                        <div className="flex justify-between mb-4">
                            <Text>Phí vận chuyển:</Text>
                            <Text>15,000đ</Text>
                        </div>

                        <Divider />

                        <div className="flex justify-between mb-6">
                            <Text strong className="text-lg">Tổng thanh toán:</Text>
                            <Text strong className="text-lg text-[#ee4d2d]">
                                {(totalAmount + 15000).toLocaleString()}đ
                            </Text>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            className="w-full !bg-[#ee4d2d] !border-[#ee4d2d] hover:!bg-[#d73211] hover:!border-[#d73211]"
                            onClick={() => form.submit()}
                        >
                            Đặt hàng
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Banking Payment Modal */}
            <Modal
                title="Thông tin chuyển khoản"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={400}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleModalOk}>
                        Đã chuyển khoản
                    </Button>,
                ]}
            >
                <div className="text-center">
                    <img
                        src="/qr-code.png"
                        alt="QR Code"
                        className="w-48 h-48 mx-auto mb-4"
                    />
                    <div className="space-y-2">
                        <Text strong className="block">Số tài khoản: 1234567890</Text>
                        <Text strong className="block">Ngân hàng: Vietcombank</Text>
                        <Text strong className="block">Chủ tài khoản: Công ty TNHH EMT Shop</Text>
                        <Text strong className="block text-[#ee4d2d]">
                            Số tiền: {(totalAmount + 15000).toLocaleString()}đ
                        </Text>
                        <Text className="text-gray-500">
                            Vui lòng chuyển khoản đúng số tiền và ghi nội dung: "ĐH {form.getFieldValue('phone')}"
                        </Text>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CheckoutClient; 