'use client';
import { useState } from "react";
import { Modal, Form, Input, Select, message, notification, Row, Col } from "antd";
import { handleCreateMenuAction } from "@/utils/actions";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    restaurants: any[];
}

const MenuCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen, restaurants } = props;
    const [form] = Form.useForm();
    const [restaurantId, setRestaurantId] = useState<string | undefined>(undefined);

    const handleCloseCreateModal = () => {
        form.resetFields();
        setRestaurantId(undefined);
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        try {
            if (typeof values.restaurant_id === 'object' && values.restaurant_id?._id) {
                values.restaurant_id = values.restaurant_id._id;
            }

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
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Restaurant"
                            name="restaurant_id"
                            rules={[{ required: true, message: "Please select a restaurant!" }]}
                        >
                            <Select
                                placeholder="Select restaurant"
                                onChange={(val) => setRestaurantId(val)}
                            >
                                {restaurants.map((r) => (
                                    <Select.Option key={r._id} value={r._id}>
                                        {r.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: "Please input menu title!" }]}
                        >
                            <Input placeholder="Enter menu title" disabled={!restaurantId} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Description" name="description">
                            <Input.TextArea placeholder="Enter description" disabled={!restaurantId} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default MenuCreate; 