'use client';
import { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { handleUpdateMenuItemAction } from "@/utils/actions";
import type { UploadFile } from "antd/es/upload/interface";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    menus: any[];
}

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MenuItemsUpdate = ({ isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, menus }: IProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                menu_id: typeof dataUpdate.menu_id === 'object' ? dataUpdate.menu_id._id : dataUpdate.menu_id,
                title: dataUpdate.title,
                description: dataUpdate.description,
                base_price: dataUpdate.base_price,
            });
            if (dataUpdate.image) {
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: dataUpdate.image
                }]);
            } else {
                setFileList([]);
            }
        }
    }, [dataUpdate, form]);

    const handleClose = () => {
        form.resetFields();
        setFileList([]);
        setDataUpdate(null);
        setIsUpdateModalOpen(false);
    };

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 800;
                    if (width > height && width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: file.type,
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        file.type,
                        0.7
                    );
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || file.preview || '');
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file: File) => {
        const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
        if (!isImage) {
            message.error('You can only upload JPG, PNG or WebP images!');
            return false;
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('Image must be smaller than 1MB!');
            return false;
        }
        return false;
    };

    const onFinish = async (values: any) => {
        try {
            if (!fileList.length) {
                message.error('Please upload an image!');
                return;
            }
            let imageData = null;
            if (fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj;
                if (file.size > MAX_FILE_SIZE) {
                    message.error('Image size must be less than 1MB');
                    return;
                }
                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                    message.error('Only JPG, PNG and WebP images are allowed');
                    return;
                }
                const compressedFile = await compressImage(file);
                imageData = await getBase64(compressedFile);
            }
            const payload: any = {
                _id: dataUpdate._id,
                menu_id: values.menu_id,
                title: values.title,
                description: values.description,
                base_price: values.base_price,
                image: fileList.length === 0 ? "" : (imageData || dataUpdate?.image),
            };
            const res = await handleUpdateMenuItemAction(payload);
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
        <>
            <Modal
                title="Update Menu Item"
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={handleClose}
                okText="Update"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Menu"
                        name="menu_id"
                        rules={[{ required: true, message: "Chọn menu!" }]}
                    >
                        <Select
                            placeholder="Chọn menu"
                            allowClear
                        >
                            {menus.map(menu => (
                                <Select.Option key={menu._id} value={menu._id}>{menu.title}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Nhập tên món!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Base Price"
                        name="base_price"
                        rules={[{ required: true, message: "Nhập giá!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onPreview={handlePreview}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={previewOpen}
                title="Image Preview"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={800}
            >
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default MenuItemsUpdate;
