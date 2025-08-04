'use client'

import {
    Table,
    Card,
    Input,
    Select,
    Button,
    Space,
    Tag,
    Image,
    Modal,
    message,
    Row,
    Col,
    Statistic,
    Tooltip,
    Popconfirm
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    TranslationOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

const { Option } = Select;
const { Search } = Input;

interface CrawlData {
    id: string;
    title: string;
    description: string;
    price?: number;
    image?: string;
    videoUrl?: string;
    rawUrl: string;
    source: string;
    type: 'product' | 'news' | 'video';
    language: string;
    translated: boolean;
    status: 'pending' | 'translated' | 'approved';
    createdAt: string;
}

const CrawlDataView = () => {
    const [data, setData] = useState<CrawlData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSource, setFilterSource] = useState<string>('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState<CrawlData | null>(null);

    // Mock data
    useEffect(() => {
        setData([
            {
                id: '1',
                title: 'Laptop Dell Inspiron 15 3000 Series',
                description: 'Powerful laptop with Intel Core i5 processor, 8GB RAM, 256GB SSD',
                price: 15990000,
                image: 'https://via.placeholder.com/150x150?text=Laptop',
                rawUrl: 'https://shopee.vn/laptop-dell-inspiron-15',
                source: 'Shopee',
                type: 'product',
                language: 'vi',
                translated: true,
                status: 'approved',
                createdAt: '2024-01-15 10:30:00'
            },
            {
                id: '2',
                title: 'Công nghệ AI phát triển mạnh mẽ trong năm 2024',
                description: 'Các công ty công nghệ lớn đang đầu tư mạnh vào AI...',
                rawUrl: 'https://vnexpress.net/ai-development-2024',
                source: 'VnExpress',
                type: 'news',
                language: 'vi',
                translated: false,
                status: 'pending',
                createdAt: '2024-01-15 09:15:00'
            },
            {
                id: '3',
                title: 'How to Build a Web Scraper with Python',
                description: 'Learn how to create efficient web scrapers using Python...',
                videoUrl: 'https://www.youtube.com/watch?v=example',
                rawUrl: 'https://www.youtube.com/watch?v=example',
                source: 'YouTube',
                type: 'video',
                language: 'en',
                translated: false,
                status: 'pending',
                createdAt: '2024-01-15 08:45:00'
            }
        ]);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green';
            case 'translated': return 'blue';
            case 'pending': return 'orange';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'product': return 'blue';
            case 'news': return 'green';
            case 'video': return 'purple';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Content',
            key: 'content',
            render: (record: CrawlData) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.image && (
                        <Image
                            width={50}
                            height={50}
                            src={record.image}
                            style={{ marginRight: '12px', objectFit: 'cover' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                    )}
                    <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {record.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                            {record.description?.substring(0, 100)}
                            {record.description && record.description.length > 100 && '...'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                            {record.rawUrl}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={getTypeColor(type)}>
                    {type.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (source: string) => (
                <Tag color="cyan">{source}</Tag>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price?: number) => (
                price ? (
                    <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                        {price.toLocaleString('vi-VN')} ₫
                    </span>
                ) : '-'
            )
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            render: (language: string) => (
                <Tag color={language === 'vi' ? 'green' : 'orange'}>
                    {language.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: CrawlData) => (
                <Space direction="vertical" size="small">
                    <Tag color={getStatusColor(status)}>
                        {status.toUpperCase()}
                    </Tag>
                    {!record.translated && (
                        <Tag color="red" icon={<TranslationOutlined />}>
                            NEEDS TRANSLATION
                        </Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => (
                <div>
                    <div>{createdAt.split(' ')[0]}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {createdAt.split(' ')[1]}
                    </div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: CrawlData) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Translate">
                        <Button
                            size="small"
                            icon={<TranslationOutlined />}
                            disabled={record.translated}
                            onClick={() => handleTranslate(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
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

    const filteredData = data.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesSource = filterSource === 'all' || item.source === filterSource;

        return matchesSearch && matchesType && matchesStatus && matchesSource;
    });

    const handleViewDetails = (record: CrawlData) => {
        setSelectedData(record);
        setDetailModalVisible(true);
    };

    const handleEdit = (record: CrawlData) => {
        message.info('Edit functionality coming soon...');
    };

    const handleTranslate = (id: string) => {
        message.success('Translation started...');
        // API call to translate
    };

    const handleDelete = (id: string) => {
        setData(data.filter(item => item.id !== id));
        message.success('Item deleted successfully');
    };

    const handleBulkTranslate = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select items to translate');
            return;
        }
        message.success(`Starting translation for ${selectedRowKeys.length} items...`);
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select items to delete');
            return;
        }
        setData(data.filter(item => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} items deleted successfully`);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: CrawlData[], info: { type: 'all' | 'none' | 'invert' | 'single' | 'multiple' }) => {
            setSelectedRowKeys(selectedRowKeys.map(key => key.toString()));
        },
    };

    const stats = {
        total: data.length,
        products: data.filter(item => item.type === 'product').length,
        news: data.filter(item => item.type === 'news').length,
        videos: data.filter(item => item.type === 'video').length,
        pendingTranslation: data.filter(item => !item.translated).length
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '24px' }}>
                    <h2>📊 Crawl Data Management</h2>

                    {/* Statistics */}
                    <Row gutter={16} style={{ marginBottom: '16px' }}>
                        <Col span={4}>
                            <Statistic title="Total Items" value={stats.total} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Products" value={stats.products} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="News" value={stats.news} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Videos" value={stats.videos} />
                        </Col>
                        <Col span={4}>
                            <Statistic
                                title="Need Translation"
                                value={stats.pendingTranslation}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Col>
                    </Row>

                    {/* Filters and Search */}
                    <Row gutter={16} style={{ marginBottom: '16px' }}>
                        <Col span={8}>
                            <Search
                                placeholder="Search by title or description..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                        <Col span={4}>
                            <Select
                                placeholder="Type"
                                value={filterType}
                                onChange={setFilterType}
                                style={{ width: '100%' }}
                            >
                                <Option value="all">All Types</Option>
                                <Option value="product">Product</Option>
                                <Option value="news">News</Option>
                                <Option value="video">Video</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select
                                placeholder="Status"
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: '100%' }}
                            >
                                <Option value="all">All Status</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="translated">Translated</Option>
                                <Option value="approved">Approved</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select
                                placeholder="Source"
                                value={filterSource}
                                onChange={setFilterSource}
                                style={{ width: '100%' }}
                            >
                                <Option value="all">All Sources</Option>
                                <Option value="Shopee">Shopee</Option>
                                <Option value="VnExpress">VnExpress</Option>
                                <Option value="YouTube">YouTube</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setSearchText('');
                                        setFilterType('all');
                                        setFilterStatus('all');
                                        setFilterSource('all');
                                    }}
                                >
                                    Reset
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    {/* Bulk Actions */}
                    {selectedRowKeys.length > 0 && (
                        <Row style={{ marginBottom: '16px' }}>
                            <Col>
                                <Space>
                                    <span>Selected {selectedRowKeys.length} items:</span>
                                    <Button
                                        icon={<TranslationOutlined />}
                                        onClick={handleBulkTranslate}
                                    >
                                        Translate Selected
                                    </Button>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={handleBulkDelete}
                                    >
                                        Delete Selected
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    )}
                </div>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`
                    }}
                />
            </Card>

            {/* Detail Modal */}
            <Modal
                title="Item Details"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                {selectedData && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <h4>Basic Information</h4>
                                <p><strong>Title:</strong> {selectedData.title}</p>
                                <p><strong>Type:</strong>
                                    <Tag color={getTypeColor(selectedData.type)} style={{ marginLeft: '8px' }}>
                                        {selectedData.type.toUpperCase()}
                                    </Tag>
                                </p>
                                <p><strong>Source:</strong> {selectedData.source}</p>
                                <p><strong>Language:</strong> {selectedData.language}</p>
                                <p><strong>Status:</strong>
                                    <Tag color={getStatusColor(selectedData.status)} style={{ marginLeft: '8px' }}>
                                        {selectedData.status.toUpperCase()}
                                    </Tag>
                                </p>
                                {selectedData.price && (
                                    <p><strong>Price:</strong> {selectedData.price.toLocaleString('vi-VN')} ₫</p>
                                )}
                            </Col>
                            <Col span={12}>
                                <h4>Media</h4>
                                {selectedData.image && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <strong>Image:</strong>
                                        <Image
                                            width={200}
                                            src={selectedData.image}
                                            style={{ display: 'block', marginTop: '8px' }}
                                        />
                                    </div>
                                )}
                                {selectedData.videoUrl && (
                                    <p><strong>Video URL:</strong> <a href={selectedData.videoUrl} target="_blank" rel="noopener noreferrer">{selectedData.videoUrl}</a></p>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <h4>Description</h4>
                                <p>{selectedData.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <h4>Original URL</h4>
                                <a href={selectedData.rawUrl} target="_blank" rel="noopener noreferrer">
                                    {selectedData.rawUrl}
                                </a>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CrawlDataView; 