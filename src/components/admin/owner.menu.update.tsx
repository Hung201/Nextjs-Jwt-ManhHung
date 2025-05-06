'use client';
import { useEffect } from "react";
import { Modal, Form, Input, Select, message, notification, Row, Col } from "antd";
import { handleUpdateMenuAction } from "@/utils/actions";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    restaurants: any[];
}

const OwnerMenuUpdate = (props: IProps) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, restaurants } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                restaurant_id: typeof dataUpdate.restaurant_id === 'object'
                    ? dataUpdate.restaurant_id._id
                    : dataUpdate.restaurant_id,
            });
        }
    }, [dataUpdate, form]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setDataUpdate(null);
        setIsUpdateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        try {
            const res = await handleUpdateMenuAction({
                ...values,
                _id: dataUpdate._id
            });

            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update menu succeed!")
            } else {
                notification.error({
                    message: "Update Menu error",
                    description: res?.message
                })
            }
        } catch (error) {
            notification.error({
                message: "Update Menu error",
                description: "An error occurred while updating menu"
            })
        }
    };

    // Giả sử restaurants chỉ có 1 phần tử là restaurant của owner
    const ownerRestaurant = restaurants[0];

    return (
        <Modal
            title="Update menu"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseUpdateModal}
            maskClosable={false}
            width={720}
            okText="Update"
            cancelText="Cancel"
        >
            <Form
                name="update-menu-form"
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

export default OwnerMenuUpdate;
