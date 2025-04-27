import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, notification, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { handleUpdateMenuAction } from "@/utils/actions";
import type { UploadFile } from "antd/es/upload/interface";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    restaurants: any[];
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MenuUpdate = (props: IProps) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, restaurants } = props;
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                restaurant_id: typeof dataUpdate.restaurant_id === 'object'
                    ? dataUpdate.restaurant_id._id
                    : dataUpdate.restaurant_id,
            });
            if (dataUpdate.image) {
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: dataUpdate.image
                }]);
            }
        }
    }, [dataUpdate, form]);

    const handleCloseUpdateModal = () => {
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
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions while maintaining aspect ratio
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
            if (typeof values.restaurant_id === 'object' && values.restaurant_id?._id) {
                values.restaurant_id = values.restaurant_id._id;
            }
            // Remove image from form values since we'll handle it separately
            const { image, ...formData } = values;

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

            // Include image data in the request
            const res = await handleUpdateMenuAction({
                ...formData,
                image: imageData || dataUpdate?.image,
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

    return (
        <>
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
                >
                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Form.Item
                                label="Restaurant"
                                name="restaurant_id"
                                rules={[{ required: true, message: "Please select a restaurant!" }]}
                            >
                                <Select placeholder="Select restaurant">
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
                                <Input placeholder="Enter menu title" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Description" name="description">
                                <Input.TextArea placeholder="Enter description" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Image"
                                extra="Only JPG, PNG or WebP images smaller than 1MB are allowed"
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
                        </Col>
                    </Row>
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

export default MenuUpdate; 