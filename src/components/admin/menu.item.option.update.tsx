'use client';
import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { handleUpdateMenuItemOptionAction } from "@/utils/actions";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    menuItems: any[];
}

const MenuItemOptionUpdate = ({ isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, menuItems }: IProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                menu_item_id: typeof dataUpdate.menu_item_id === 'object' ? dataUpdate.menu_item_id._id : dataUpdate.menu_item_id,
                title: dataUpdate.title,
                additional_price: dataUpdate.additional_price,
                optional_description: dataUpdate.optional_description,
            });
        }
    }, [dataUpdate, form]);

    const handleClose = () => {
        form.resetFields();
        setDataUpdate(null);
        setIsUpdateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        try {
            const payload = {
                _id: dataUpdate._id,
                menu_item_id: values.menu_item_id,
                title: values.title,
                additional_price: values.additional_price,
                optional_description: values.optional_description,
            };
            const res = await handleUpdateMenuItemOptionAction(payload);
            if (res?.data) {
                message.success("Cập nhật thành công!");
                handleClose();
            } else {
                message.error(res?.message || "Cập nhật thất bại!");
            }
        } catch (error) {
            message.error("Cập nhật thất bại!");
        }
    };

    return (
        <Modal
            title="Update Menu Item Option"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            okText="Update"
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
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Additional Price"
                    name="additional_price"
                    rules={[{ required: true, message: "Nhập giá!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Optional Description"
                    name="optional_description"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MenuItemOptionUpdate;
