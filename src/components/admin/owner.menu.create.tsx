'use client';
import { useState } from "react";
import { Modal, Form, Input, Select, message, notification, Row, Col } from "antd";
import { handleCreateMenuAction } from "@/utils/actions";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    restaurants: any[];
}

const OwnerMenuCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen, restaurants } = props;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        try {
            const res = await handleCreateMenuAction({
                ...values,
            });

            if (res?.data) {
                handleCloseCreateModal();
                message.success("Create menu succeed!")
            } else {
                notification.error({
                    message: "Create Menu error",
                    description: res?.message
                })
            }
        } catch (error) {
            notification.error({
                message: "Create Menu error",
                description: "An error occurred while creating menu"
            })
        }
    };

    // Giả sử restaurants chỉ có 1 phần tử là restaurant của owner
    const ownerRestaurant = restaurants[0];

    return (
        <Modal
            title="Add new menu"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseCreateModal}
            maskClosable={false}
            width={720}
            okText="Create"
            cancelText="Cancel"
        >
            <Form
                name="create-menu-form"
                onFinish={onFinish}
                layout="vertical"
                form={form}
                initialValues={{ restaurant_id: ownerRestaurant?._id }}
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Restaurant"
                            name="restaurant_id"
                            rules={[{ required: true, message: "Please select a restaurant!" }]}
                        >
                            {/* Hiển thị tên restaurant, không cho chọn */}
                            <Input value={ownerRestaurant?.name} disabled />
                            {/* Hidden field để submit _id */}
                            <input type="hidden" name="restaurant_id" value={ownerRestaurant?._id} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: "Please input menu title!" }]}
                        >
                            <Input placeholder="Enter menu title" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Description" name="description">
                            <Input.TextArea placeholder="Enter description" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default OwnerMenuCreate;
