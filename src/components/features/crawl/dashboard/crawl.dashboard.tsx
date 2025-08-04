'use client'

import { Card, Col, Row, Statistic, Button, Space, Progress, Tag } from 'antd';
import {
    DatabaseOutlined,
    PlayCircleOutlined,
    FileTextOutlined,
    TranslationOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

interface CrawlStats {
    totalSources: number;
    activeSources: number;
    totalData: number;
    pendingTranslation: number;
    runningActors: number;
    successRate: number;
}

const CrawlDashboard = () => {
    const [stats, setStats] = useState<CrawlStats>({
        totalSources: 0,
        activeSources: 0,
        totalData: 0,
        pendingTranslation: 0,
        runningActors: 0,
        successRate: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats({
                totalSources: 12,
                activeSources: 8,
                totalData: 15420,
                pendingTranslation: 234,
                runningActors: 3,
                successRate: 87
            });
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            case 'running': return 'blue';
            default: return 'default';
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ marginBottom: '24px', color: '#1890ff' }}>
                🚀 Crawl System Dashboard
            </h1>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Sources"
                            value={stats.totalSources}
                            prefix={<DatabaseOutlined />}
                            loading={loading}
                        />
                        <div style={{ marginTop: '8px' }}>
                            <Tag color="green">{stats.activeSources} Active</Tag>
                            <Tag color="red">{stats.totalSources - stats.activeSources} Inactive</Tag>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Data Crawled"
                            value={stats.totalData}
                            prefix={<FileTextOutlined />}
                            loading={loading}
                        />
                        <div style={{ marginTop: '8px' }}>
                            <Tag color="blue">+1,234 today</Tag>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Translation"
                            value={stats.pendingTranslation}
                            prefix={<TranslationOutlined />}
                            loading={loading}
                            valueStyle={{ color: '#faad14' }}
                        />
                        <div style={{ marginTop: '8px' }}>
                            <Tag color="orange">Needs attention</Tag>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Running Actors"
                            value={stats.runningActors}
                            prefix={<PlayCircleOutlined />}
                            loading={loading}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <div style={{ marginTop: '8px' }}>
                            <Tag color="green">Live</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Success Rate & Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Success Rate" extra={<ClockCircleOutlined />}>
                        <div style={{ textAlign: 'center' }}>
                            <Progress
                                type="circle"
                                percent={stats.successRate}
                                format={(percent) => `${percent}%`}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                            />
                            <div style={{ marginTop: '16px' }}>
                                <Space>
                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                        Success: {Math.round(stats.totalData * stats.successRate / 100)}
                                    </Tag>
                                    <Tag icon={<ExclamationCircleOutlined />} color="error">
                                        Failed: {Math.round(stats.totalData * (100 - stats.successRate) / 100)}
                                    </Tag>
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Quick Actions">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<PlayCircleOutlined />}
                                size="large"
                                block
                            >
                                Run All Active Sources
                            </Button>
                            <Button
                                icon={<TranslationOutlined />}
                                size="large"
                                block
                            >
                                Translate Pending Content
                            </Button>
                            <Button
                                icon={<DatabaseOutlined />}
                                size="large"
                                block
                            >
                                View Recent Data
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Recent Crawl Activity">
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {[
                                { source: 'Shopee', status: 'success', time: '2 minutes ago', data: 45 },
                                { source: 'VnExpress', status: 'running', time: '5 minutes ago', data: 12 },
                                { source: 'YouTube', status: 'failed', time: '10 minutes ago', data: 0 },
                                { source: 'Tiki', status: 'success', time: '15 minutes ago', data: 23 },
                                { source: 'Lazada', status: 'success', time: '20 minutes ago', data: 67 }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    padding: '12px 0',
                                    borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.source}</div>
                                        <div style={{ color: '#666', fontSize: '12px' }}>{item.time}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Tag color={item.status === 'success' ? 'green' : item.status === 'running' ? 'blue' : 'red'}>
                                            {item.status}
                                        </Tag>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {item.data} items
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="System Status">
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {[
                                { service: 'Apify Platform', status: 'online', uptime: '99.9%' },
                                { service: 'Translation API', status: 'online', uptime: '98.5%' },
                                { service: 'Database', status: 'online', uptime: '99.8%' },
                                { service: 'File Storage', status: 'online', uptime: '99.7%' },
                                { service: 'Email Service', status: 'warning', uptime: '95.2%' }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    padding: '12px 0',
                                    borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.service}</div>
                                        <div style={{ color: '#666', fontSize: '12px' }}>
                                            Uptime: {item.uptime}
                                        </div>
                                    </div>
                                    <Tag color={item.status === 'online' ? 'green' : item.status === 'warning' ? 'orange' : 'red'}>
                                        {item.status}
                                    </Tag>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CrawlDashboard; 