'use client';
import { handleCreateRestaurantAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification, InputNumber
} from 'antd';
import { useState } from 'react';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const RestaurantCreate = (props: IProps) => {
    const {
        isCreateModalOpen, setIsCreateModalOpen
    } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);
    }

    const onFinish = async (values: any) => {
        try {
            const res = await handleCreateRestaurantAction(values);
            if (res?.data) {
                handleCloseCreateModal();
                message.success("Create succeed!")
            } else {
                notification.error({
                    message: "Create Restaurant error",
                    description: res?.message
                })
            }
        } catch (error) {
            notification.error({
                message: "Create Restaurant error",
                description: "An error occurred while creating restaurant"
            })
        }
    };

    return (
        <Modal
            title="Add new restaurant"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
            width={720}
            okText="Create"
            cancelText="Cancel"
        >
            <Form
                name="create-restaurant-form"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input restaurant name!' }]}
                        >
                            <Input placeholder="Enter restaurant name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input email!' }]}
                        >
                            <Input type='email' placeholder="Enter email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input phone number!' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            initialValue={5}
                            rules={[{ required: true, message: 'Please input rating!' }]}
                        >
                            <InputNumber min={1} max={5} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input address!' }]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default RestaurantCreate; 