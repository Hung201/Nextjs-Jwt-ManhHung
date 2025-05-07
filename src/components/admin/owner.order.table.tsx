'use client';

import { Table, Tag } from 'antd';

interface IProps {
    orders: any[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const OwnerOrderTable = ({ orders, meta }: IProps) => {
    const columns = [
        { title: 'Order ID', dataIndex: '_id', key: '_id', width: 180 },
        { title: 'User', dataIndex: 'user_id', key: 'user_id', render: (user: any) => user?.name || user?.email || '-' },
        { title: 'Restaurant', dataIndex: 'restaurant_id', key: 'restaurant_id', render: (r: any) => r?.name || r || '-' },
        {
            title: 'Shipping Info', dataIndex: 'shipping_info', key: 'shipping_info', render: (info: any) => (
                <div>
                    <div><b>{info?.full_name}</b></div>
                    <div>{info?.phone}</div>
                    <div>{info?.email}</div>
                    <div>{info?.address}</div>
                </div>
            )
        },
        { title: 'Payment', dataIndex: 'payment_method', key: 'payment_method', render: (v: string) => <Tag color={v === 'COD' ? 'green' : 'blue'}>{v}</Tag> },
        {
            title: 'Items', dataIndex: 'items', key: 'items', render: (items: any[]) => (
                <ul style={{ paddingLeft: 16 }}>
                    {items?.map((item, idx) => (
                        <li key={idx}>
                            <b>{item.name}</b> x{item.quantity} - {item.price?.toLocaleString()}đ
                            {item.option && <span> ({item.option})</span>}
                        </li>
                    ))}
                </ul>
            )
        },
        { title: 'Total Price', dataIndex: 'total_price', key: 'total_price', render: (v: number) => v?.toLocaleString() + 'đ' },
        { title: 'Shipping Fee', dataIndex: 'shipping_fee', key: 'shipping_fee', render: (v: number) => v?.toLocaleString() + 'đ' },
        { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', render: (v: number) => <b style={{ color: '#ee4d2d' }}>{v?.toLocaleString()}đ</b> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'ordered' ? 'blue' : 'green'}>{v}</Tag> },
    ];

    return (
        <Table
            bordered
            dataSource={orders}
            columns={columns}
            rowKey="_id"
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total,
                showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} đơn hàng`,
            }}
        />
    );
};

export default OwnerOrderTable; 