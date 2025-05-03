import { handleUpdateRestaurantAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification, InputNumber, Upload, Select
} from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { getAllUsers } from '@/utils/actions';

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

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
                rating: dataUpdate.rating,
                user_id: dataUpdate.user_id
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
    }, [dataUpdate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getAllUsers();
            setUsers(res?.data?.results || []);
        };
        fetchUsers();
    }, []);

    const handleCloseUpdateModal = () => {
        form.resetFields();
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
                const { _id, name, email, phone, address, rating, user_id } = values;
                let imageData = dataUpdate.image;
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
                const res = await handleUpdateRestaurantAction({
                    _id: dataUpdate._id,
                    name,
                    email,
                    phone,
                    address,
                    rating,
                    user_id,
                    image: fileList.length === 0 ? "" : imageData
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
                    <Col span={12}>
                        <Form.Item
                            label="User"
                            name="user_id"
                            rules={[{ required: true, message: 'Please select a user!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a user"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                                options={users.map(user => ({
                                    value: user._id,
                                    label: user.name || user.email
                                }))}
                            />
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
        </Modal>
    )
}

export default RestaurantUpdate;
