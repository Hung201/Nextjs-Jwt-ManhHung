'use client'
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive';
import { useState } from 'react';
import ModalChangePassword from './modal.change.password';
import { startProgress, doneProgress } from '@/utils/nprogress';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Typography, Card } from 'antd';
import { getSession } from 'next-auth/react';

const { Title } = Typography;

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setUserEmail("");
        try {
            startProgress();
            const res = await authenticate(username, password);
            if (res?.error) {
                doneProgress();
                if (res?.code === 2) {
                    setIsModalOpen(true);
                    setUserEmail(username);
                    return;
                }
                notification.error({
                    message: "Error login",
                    description: res?.error
                });
            } else {
                doneProgress();
                // Get latest session and redirect based on role
                const session = await getSession();
                if (session?.user?.role === 'CUSTOMER') {
                    window.location.href = '/';
                } else {
                    window.location.href = '/dashboard';
                }
            }
        } catch (error) {
            doneProgress();
            notification.error({
                message: "Error login",
                description: "An unexpected error occurred"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-blue-100">
            <Card className="w-full max-w-md shadow-lg rounded-xl p-8">
                <Title level={3} className="text-center mb-6">Login</Title>
                <Form name="basic" onFinish={onFinish} autoComplete="off" layout='vertical'>
                    <Form.Item
                        label="Email"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your email!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" className="mt-2">
                            Login
                        </Button>
                    </Form.Item>
                    <div className="flex justify-between items-center mb-2">
                        <Link href="/auth/register" className="text-blue-500 hover:underline">Register</Link>
                        <Button type='link' className="p-0" onClick={() => setChangePassword(true)}>Forgot password?</Button>
                    </div>
                    <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                        <ArrowLeftOutlined /> Back to home
                    </Link>
                </Form>
            </Card>
            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
            />
            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
            />
        </div>
    )
}

export default Login;