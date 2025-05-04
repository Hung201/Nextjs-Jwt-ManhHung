'use client';
import { useState, useEffect } from 'react';
import { Form, Input, Row, Col, InputNumber, Upload, Button, message, Modal, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { handleCreateRestaurantAction, handleUpdateRestaurantAction } from '@/utils/actions';

interface OwnerRestaurantProps {
    session: any;
    restaurant: any;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const OwnerRestaurant = ({ session, restaurant }: OwnerRestaurantProps) => {
    console.log('DEBUG restaurant prop:', restaurant);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (restaurant) {
            form.setFieldsValue({
                name: restaurant.name,
                email: restaurant.email,
                phone: restaurant.phone,
                address: restaurant.address,
                rating: restaurant.rating,
            });
            if (restaurant.image) {
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: restaurant.image
                }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
            form.setFieldsValue({ rating: 5 });
        }
    }, [restaurant, form]);

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
        setLoading(true);
        try {
            let imageData = restaurant?.image || null;
            if (fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj;
                if (file.size > MAX_FILE_SIZE) {
                    message.error('Image size must be less than 1MB');
                    setLoading(false);
                    return;
                }
                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                    message.error('Only JPG, PNG and WebP images are allowed');
                    setLoading(false);
                    return;
                }
                const compressedFile = await compressImage(file);
                imageData = await getBase64(compressedFile);
            }
            if (restaurant) {
                // Update
                const res = await handleUpdateRestaurantAction({
                    _id: restaurant._id,
                    ...values,
                    user_id: session.user._id,
                    image: fileList.length === 0 ? '' : imageData
                });
                if (res?.data) {
                    message.success('Update succeed!');
                } else {
                    notification.error({
                        message: 'Update Restaurant error',
                        description: res?.message
                    });
                }
            } else {
                // Create
                const res = await handleCreateRestaurantAction({
                    ...values,
                    user_id: session.user._id,
                    image: imageData
                });
                if (res?.data) {
                    message.success('Create succeed!');
                    form.resetFields();
                    setFileList([]);
                } else {
                    notification.error({
                        message: 'Create Restaurant error',
                        description: res?.message
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: restaurant ? 'Update Restaurant error' : 'Create Restaurant error',
                description: 'An error occurred while processing restaurant'
            });
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>{restaurant ? 'Update My Restaurant' : 'Create My Restaurant'}</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 16 }}>
                    {restaurant ? 'Update' : 'Create'}
                </Button>
            </Form>
            <Modal
                open={previewOpen}
                title="Image Preview"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={800}
            >
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default OwnerRestaurant;
