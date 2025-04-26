'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { startProgress, doneProgress } from '@/utils/nprogress';

type MenuItem = Required<MenuProps>['items'][number];
const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const router = useRouter();

    const handleNavigation = (href: string) => {
        startProgress();
        router.push(href);
        doneProgress();
    };

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'Hỏi Dân IT',
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <span onClick={() => handleNavigation("/dashboard")}>Dashboard</span>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "users",
                    label: <span onClick={() => handleNavigation("/dashboard/user")}>Manage Users</span>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "restaurants",
                    label: <span onClick={() => handleNavigation("/dashboard/restaurant")}>Manage Restaurants</span>,
                    icon: <TeamOutlined />,
                },
                {
                    key: 'sub1',
                    label: 'Navigation One',
                    icon: <MailOutlined />,
                    children: [
                        {
                            key: 'g1',
                            label: 'Item 1',
                            type: 'group',
                            children: [
                                { key: '1', label: 'Option 1' },
                                { key: '2', label: 'Option 2' },
                            ],
                        },
                        {
                            key: 'g2',
                            label: 'Item 2',
                            type: 'group',
                            children: [
                                { key: '3', label: 'Option 3' },
                                { key: '4', label: 'Option 4' },
                            ],
                        },
                    ],
                },
                {
                    key: 'sub2',
                    label: 'Navigation Two',
                    icon: <AppstoreOutlined />,
                    children: [
                        { key: '5', label: 'Option 5' },
                        { key: '6', label: 'Option 6' },
                        {
                            key: 'sub3',
                            label: 'Submenu',
                            children: [
                                { key: '7', label: 'Option 7' },
                                { key: '8', label: 'Option 8' },
                            ],
                        },
                    ],
                },
                {
                    type: 'divider',
                },
                {
                    key: 'sub4',
                    label: 'Navigation Three',
                    icon: <SettingOutlined />,
                    children: [
                        { key: '9', label: 'Option 9' },
                        { key: '10', label: 'Option 10' },
                        { key: '11', label: 'Option 11' },
                        { key: '12', label: 'Option 12' },
                    ],
                },
            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;