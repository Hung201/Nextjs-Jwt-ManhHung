'use client'

import { 
    Table, 
    Button, 
    Space, 
    Tag, 
    Modal, 
    Form, 
    Input, 
    Select, 
    Switch, 
    message, 
    Popconfirm,
    Card,
    Row,
    Col,
    Tooltip
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    PlayCircleOutlined,
    PauseCircleOutlined,
    EyeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface CrawlSource {
    id: string;
    name: string;
    type: 'product' | 'news' | 'video';
    startUrls: string[];
    schedule: string;
    actorId: string;
    status: 'active' | 'inactive' | 'archived';
    lastRun: string;
    totalCrawled: number;
    successRate: number;
    createdAt: string;
}

const SourcesManagement = () => {
    const [sources, setSources] = useState<CrawlSource[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSource, setEditingSource] = useState<CrawlSource | null>(null);
    const [form] = Form.useForm();

    // Mock data
    useEffect(() => {
        setSources([
            {
                id: '1',
                name: 'Shopee Products',
                type: 'product',
                startUrls: ['https://shopee.vn/search?keyword=laptop'],
                schedule: '0 */6 * * *',
                actorId: 'shopee-product-crawler',
                status: 'active',
                lastRun: '2024-01-15 10:30:00',
                totalCrawled: 15420,
                successRate: 95,
                createdAt: '2024-01-01'
            },
            {
                id: '2',
                name: 'VnExpress News',
                type: 'news',
                startUrls: ['https://vnexpress.net/cong-nghe', 'https://vnexpress.net/the-gioi'],
                schedule: '0 */2 * * *',
                actorId: 'vnexpress-news-crawler',
                status: 'active',
                lastRun: '2024-01-15 09:15:00',
                totalCrawled: 8920,
                successRate: 98,
                createdAt: '2024-01-05'
            },
            {
                id: '3',
                name: 'YouTube Videos',
                type: 'video',
                startUrls: ['https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw'],
                schedule: '0 */12 * * *',
                actorId: 'youtube-video-crawler',
                status: 'inactive',
                lastRun: '2024-01-14 18:45:00',
                totalCrawled: 2340,
                successRate: 87,
                createdAt: '2024-01-10'
            }
        ]);
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: CrawlSource) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Actor: {record.actorId}
                    </div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={
                    type === 'product' ? 'blue' : 
                    type === 'news' ? 'green' : 'purple'
                }>
                    {type.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={
                    status === 'active' ? 'green' : 
                    status === 'inactive' ? 'red' : 'default'
                }>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule',
            key: 'schedule',
            render: (schedule: string) => (
                <Tooltip title={schedule}>
                    <Tag color="orange">{schedule}</Tag>
                </Tooltip>
            )
        },
        {
            title: 'Last Run',
            dataIndex: 'lastRun',
            key: 'lastRun',
            render: (lastRun: string) => (
                <div>
                    <div>{lastRun.split(' ')[0]}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {lastRun.split(' ')[1]}
                    </div>
                </div>
            )
        },
        {
            title: 'Stats',
            key: 'stats',
            render: (record: CrawlSource) => (
                <div>
                    <div>Total: {record.totalCrawled.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Success: {record.successRate}%
                    </div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: CrawlSource) => (
                <Space>
                    <Tooltip title="Run Now">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleRunSource(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="View Data">
                        <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => handleViewData(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Settings">
                        <Button 
                            size="small" 
                            icon={<SettingOutlined />}
                            onClick={() => handleSettings(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this source?"
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
        setEditingSource(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (source: CrawlSource) => {
        setEditingSource(source);
        form.setFieldsValue({
            name: source.name,
            type: source.type,
            startUrls: source.startUrls.join('\n'),
            schedule: source.schedule,
            actorId: source.actorId,
            status: source.status === 'active'
        });
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        setSources(sources.filter(s => s.id !== id));
        message.success('Source deleted successfully');
    };

    const handleRunSource = (id: string) => {
        message.success('Starting crawl process...');
        // API call to run actor
    };

    const handleViewData = (id: string) => {
        // Navigate to data view
        message.info('Navigating to data view...');
    };

    const handleSettings = (id: string) => {
        message.info('Opening settings...');
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const sourceData = {
                ...values,
                startUrls: values.startUrls.split('\n').filter((url: string) => url.trim()),
                status: values.status ? 'active' : 'inactive'
            };

            if (editingSource) {
                // Update existing source
                setSources(sources.map(s => 
                    s.id === editingSource.id 
                        ? { ...s, ...sourceData }
                        : s
                ));
                message.success('Source updated successfully');
            } else {
                // Add new source
                const newSource: CrawlSource = {
                    id: Date.now().toString(),
                    ...sourceData,
                    lastRun: '-',
                    totalCrawled: 0,
                    successRate: 0,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setSources([...sources, newSource]);
                message.success('Source added successfully');
            }
            setModalVisible(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
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
                    <h2>📊 Crawl Sources Management</h2>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add New Source
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={sources}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} sources`
                    }}
                />
            </Card>

            <Modal
                title={editingSource ? 'Edit Source' : 'Add New Source'}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
                width={600}
                okText={editingSource ? 'Update' : 'Create'}
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: true
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Source Name"
                                rules={[{ required: true, message: 'Please enter source name' }]}
                            >
                                <Input placeholder="e.g., Shopee Products" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Data Type"
                                rules={[{ required: true, message: 'Please select data type' }]}
                            >
                                <Select placeholder="Select type">
                                    <Option value="product">Product</Option>
                                    <Option value="news">News</Option>
                                    <Option value="video">Video</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="startUrls"
                        label="Start URLs (one per line)"
                        rules={[{ required: true, message: 'Please enter at least one URL' }]}
                    >
                        <TextArea 
                            rows={4}
                            placeholder="https://example.com/page1&#10;https://example.com/page2"
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="schedule"
                                label="Schedule (Cron)"
                                rules={[{ required: true, message: 'Please enter schedule' }]}
                            >
                                <Input placeholder="0 */6 * * *" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="actorId"
                                label="Actor ID"
                                rules={[{ required: true, message: 'Please enter actor ID' }]}
                            >
                                <Input placeholder="e.g., shopee-crawler" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="status"
                        label="Active Status"
                        valuePropName="checked"
                    >
                        <Switch 
                            checkedChildren="Active" 
                            unCheckedChildren="Inactive" 
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SourcesManagement; 