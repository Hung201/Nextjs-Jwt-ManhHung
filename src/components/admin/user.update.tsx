import { handleUpdateUserAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification, Upload, Button
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UserUpdate = (props: IProps) => {
    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address
            });

            // Check both avatar and image fields
            const userImage = dataUpdate.avatar || dataUpdate.image;
            if (userImage) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'image',
                        status: 'done',
                        url: userImage,
                    },
                ]);
            } else {
                setFileList([]);
            }
        }
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setFileList([]);
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

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
        if (dataUpdate) {
            try {
                const { name } = values;

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

                // If there's an existing image in fileList but no new upload
                if (fileList[0]?.url && !imageData) {
                    imageData = fileList[0].url;
                }

                const res = await handleUpdateUserAction({
                    _id: dataUpdate._id,
                    name,
                    image: imageData
                });

                if (res?.data) {
                    handleCloseUpdateModal();
                    message.success("Update user succeed")
                } else {
                    notification.error({
                        message: "Update User error",
                        description: res?.message
                    })
                }
            } catch (error) {
                notification.error({
                    message: "Update User error",
                    description: "An error occurred while updating user"
                });
            }
        }
    };

    return (
        <>
            <Modal
                title="Update user"
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseUpdateModal()}
                maskClosable={false}
                width={720}
                okText="Update"
                cancelText="Cancel"
            >
                <Form
                    name="update-user-form"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                            >
                                <Input type='email' disabled placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Address"
                                name="address"
                            >
                                <Input placeholder="Enter address" />
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
    )
}

export default UserUpdate;
