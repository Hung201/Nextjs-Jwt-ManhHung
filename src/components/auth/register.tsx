'use client'
import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Select, Typography, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';

const { Title } = Typography;

const Register = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const { email, password, name, role, phone, address } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: "POST",
            body: {
                email, password, name, role, phone, address
            }
        })
        if (res?.data) {
            router.push(`/verify/${res?.data?._id}`);
        } else {
            notification.error({
                message: "Register error",
                description: res?.message
            })
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-blue-100">
            <Card className="w-full max-w-lg shadow-lg rounded-xl p-8">
                <Title level={3} className="text-center mb-6">Register</Title>
                <Form
                    name="register"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout='vertical'
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                        >
                            <Input placeholder="Enter your name" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email!',
                                }
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please enter your phone!' }]}
                        >
                            <Input placeholder="Enter your phone number" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please enter your address!' }]}
                        >
                            <Input placeholder="Enter your address" />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[{ required: true, message: 'Please select a role!' }]}
                            initialValue="CUSTOMER"
                            className="md:col-span-2"
                        >
                            <Select>
                                <Select.Option value="CUSTOMER">CUSTOMER</Select.Option>
                                <Select.Option value="OWNER">OWNER</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password!',
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters!',
                            }
                        ]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" className="mt-2">
                            Register
                        </Button>
                    </Form.Item>
                    <div className="flex justify-between items-center mb-2">
                        <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link>
                        <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                            <ArrowLeftOutlined /> Back to home
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default Register;