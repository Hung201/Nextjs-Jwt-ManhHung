'use client';
import { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { handleCreateMenuItemOptionAction } from "@/utils/actions";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    menuItems: any[];
}

const MenuItemOptionCreate = ({ isCreateModalOpen, setIsCreateModalOpen, menuItems }: IProps) => {
    const [form] = Form.useForm();
    const [menuItemId, setMenuItemId] = useState<string | undefined>(undefined);

    const handleClose = () => {
        form.resetFields();
        setMenuItemId(undefined);
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        try {
            const payload = {
                menu_item_id: menuItemId,
                title: values.title,
                additional_price: values.additional_price,
                optional_description: values.optional_description,
            };
            const res = await handleCreateMenuItemOptionAction(payload);
            if (res?.data) {
                message.success("Tạo thành công!");
                handleClose();
            } else {
                message.error(res?.message || "Tạo thất bại!");
            }
        } catch (error) {
            message.error("Tạo thất bại!");
        }
    };

    return (
        <Modal
            title="Create Menu Item Option"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            okText="Create"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Menu Item"
                    name="menu_item_id"
                    rules={[{ required: true, message: "Chọn menu item!" }]}
                >
                    <Select
                        placeholder="Chọn menu item"
                        onChange={val => setMenuItemId(val)}
                        allowClear
                    >
                        {menuItems.map(item => (
                            <Select.Option key={item._id} value={item._id}>{item.title}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Nhập tiêu đề!" }]}
                >
                    <Input disabled={!menuItemId} />
                </Form.Item>
                <Form.Item
                    label="Additional Price"
                    name="additional_price"
                    rules={[{ required: true, message: "Nhập giá!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} disabled={!menuItemId} />
                </Form.Item>
                <Form.Item
                    label="Optional Description"
                    name="optional_description"
                >
                    <Input disabled={!menuItemId} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MenuItemOptionCreate;
