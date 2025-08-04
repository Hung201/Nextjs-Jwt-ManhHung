'use client'

import { 
    Table, 
    Card, 
    Button, 
    Space, 
    Tag, 
    Modal, 
    Form, 
    Input, 
    Upload, 
    message,
    Row,
    Col,
    Statistic,
    Tooltip,
    Popconfirm
} from 'antd';
import { 
    PlusOutlined, 
    UploadOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    EyeOutlined, 
    EditOutlined, 
    DeleteOutlined,
    CodeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

interface Actor {
    id: string;
    name: string;
    description: string;
    codeUrl: string;
    status: 'ready' | 'error' | 'running';
    lastRunAt: string;
    totalRuns: number;
    successRate: number;
    uploadedBy: string;
    createdAt: string;
}

const ActorsManagement = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingActor, setEditingActor] = useState<Actor | null>(null);
    const [form] = Form.useForm();

    // Mock data
    useEffect(() => {
        setActors([
            {
                id: '1',
                name: 'shopee-product-crawler',
                description: 'Crawl product data from Shopee',
                codeUrl: 'https://github.com/user/shopee-crawler',
                status: 'ready',
                lastRunAt: '2024-01-15 10:30:00',
                totalRuns: 45,
                successRate: 95,
                uploadedBy: 'admin@example.com',
                createdAt: '2024-01-01'
            },
            {
                id: '2',
                name: 'vnexpress-news-crawler',
                description: 'Crawl news articles from VnExpress',
                codeUrl: 'https://github.com/user/vnexpress-crawler',
                status: 'running',
                lastRunAt: '2024-01-15 09:15:00',
                totalRuns: 23,
                successRate: 98,
                uploadedBy: 'admin@example.com',
                createdAt: '2024-01-05'
            },
            {
                id: '3',
                name: 'youtube-video-crawler',
                description: 'Crawl video metadata from YouTube',
                codeUrl: 'https://github.com/user/youtube-crawler',
                status: 'error',
                lastRunAt: '2024-01-14 18:45:00',
                totalRuns: 12,
                successRate: 87,
                uploadedBy: 'admin@example.com',
                createdAt: '2024-01-10'
            }
        ]);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'green';
            case 'running': return 'blue';
            case 'error': return 'red';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Actor Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Actor) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {record.description}
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Last Run',
            dataIndex: 'lastRunAt',
            key: 'lastRunAt',
            render: (lastRunAt: string) => (
                <div>
                    <div>{lastRunAt.split(' ')[0]}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {lastRunAt.split(' ')[1]}
                    </div>
                </div>
            )
        },
        {
            title: 'Stats',
            key: 'stats',
            render: (record: Actor) => (
                <div>
                    <div>Runs: {record.totalRuns}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Success: {record.successRate}%
                    </div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Actor) => (
                <Space>
                    <Tooltip title="Run Actor">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<PlayCircleOutlined />}
                            disabled={record.status === 'running'}
                            onClick={() => handleRunActor(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="View Code">
                        <Button 
                            size="small" 
                            icon={<CodeOutlined />}
                            onClick={() => handleViewCode(record.codeUrl)}
                        />
                    </Tooltip>
                    <Tooltip title="Settings">
                        <Button 
                            size="small" 
                            icon={<SettingOutlined />}
                            onClick={() => handleSettings(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this actor?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button 
                                size="small" 
                                danger 
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleAdd = () => {
        setEditingActor(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (actor: Actor) => {
        setEditingActor(actor);
        form.setFieldsValue({
            name: actor.name,
            description: actor.description,
            codeUrl: actor.codeUrl
        });
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        setActors(actors.filter(a => a.id !== id));
        message.success('Actor deleted successfully');
    };

    const handleRunActor = (id: string) => {
        message.success('Starting actor...');
        // API call to run actor
    };

    const handleViewCode = (codeUrl: string) => {
        window.open(codeUrl, '_blank');
    };

    const handleSettings = (id: string) => {
        message.info('Opening settings...');
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingActor) {
                // Update existing actor
                setActors(actors.map(a => 
                    a.id === editingActor.id 
                        ? { ...a, ...values }
                        : a
                ));
                message.success('Actor updated successfully');
            } else {
                // Add new actor
                const newActor: Actor = {
                    id: Date.now().toString(),
                    ...values,
                    status: 'ready',
                    lastRunAt: '-',
                    totalRuns: 0,
                    successRate: 0,
                    uploadedBy: 'admin@example.com',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setActors([...actors, newActor]);
                message.success('Actor added successfully');
            }
            setModalVisible(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const stats = {
        total: actors.length,
        ready: actors.filter(a => a.status === 'ready').length,
        running: actors.filter(a => a.status === 'running').length,
        error: actors.filter(a => a.status === 'error').length
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h2>🤖 Actors Management</h2>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Upload New Actor
                    </Button>
                </div>

                {/* Statistics */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={6}>
                        <Statistic title="Total Actors" value={stats.total} />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Ready" 
                            value={stats.ready}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Running" 
                            value={stats.running}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Error" 
                            value={stats.error}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={actors}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} actors`
                    }}
                />
            </Card>

            <Modal
                title={editingActor ? 'Edit Actor' : 'Upload New Actor'}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
                width={600}
                okText={editingActor ? 'Update' : 'Upload'}
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Actor Name"
                        rules={[{ required: true, message: 'Please enter actor name' }]}
                    >
                        <Input placeholder="e.g., shopee-product-crawler" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <TextArea 
                            rows={3}
                            placeholder="Describe what this actor does..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="codeUrl"
                        label="Code URL (GitHub/GitLab)"
                        rules={[{ required: true, message: 'Please enter code URL' }]}
                    >
                        <Input placeholder="https://github.com/user/actor-repo" />
                    </Form.Item>

                    {!editingActor && (
                        <Form.Item
                            label="Upload Actor Code (Optional)"
                        >
                            <Upload
                                name="file"
                                action="/api/upload"
                                headers={{
                                    authorization: 'authorization-text',
                                }}
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        message.success(`${info.file.name} file uploaded successfully`);
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default ActorsManagement; 