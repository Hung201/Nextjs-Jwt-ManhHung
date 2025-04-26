import { handleUpdateRestaurantAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification, InputNumber
} from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const RestaurantUpdate = (props: IProps) => {
    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
                rating: dataUpdate.rating
            });

        }
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            try {
                const { _id, name, email, phone, address, rating } = values;
                const res = await handleUpdateRestaurantAction({
                    _id: dataUpdate._id,
                    name,
                    email,
                    phone,
                    address,
                    rating
                });
                if (res?.data) {
                    handleCloseUpdateModal();
                    message.success("Update restaurant succeed")
                } else {
                    notification.error({
                        message: "Update Restaurant error",
                        description: res?.message
                    })
                }
            } catch (error) {
                notification.error({
                    message: "Update Restaurant error",
                    description: "An error occurred while updating restaurant"
                });
            }
        }
    };

    return (
        <Modal
            title="Update restaurant"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
            maskClosable={false}
            width={720}
            okText="Update"
            cancelText="Cancel"
        >
            <Form
                name="update-restaurant-form"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="_id"
                    hidden={true}
                >
                    <Input />
                </Form.Item>
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

export default RestaurantUpdate;
