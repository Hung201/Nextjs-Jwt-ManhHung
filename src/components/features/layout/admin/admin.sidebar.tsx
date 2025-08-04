'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    TeamOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    PlayCircleOutlined,
    TranslationOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const AdminSidebar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

    const items: MenuItem[] = [

        {
            key: 'grp',
            label: 'Hung',
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: 'crawl-system',
                    label: 'Crawl System',
                    icon: <DatabaseOutlined />,
                    children: [
                        {
                            key: 'crawl-dashboard',
                            label: <Link href={"/dashboard"}>Crawl Dashboard</Link>,
                            icon: <AppstoreOutlined />,
                        },
                        {
                            key: 'crawl-sources',
                            label: <Link href={"/dashboard/sources"}>Manage Sources</Link>,
                            icon: <DatabaseOutlined />,
                        },
                        {
                            key: 'crawl-data',
                            label: <Link href={"/dashboard/crawl-data"}>Crawl Data</Link>,
                            icon: <FileTextOutlined />,
                        },
                        {
                            key: 'crawl-actors',
                            label: <Link href={"/dashboard/actors"}>Manage Actors</Link>,
                            icon: <PlayCircleOutlined />,
                        },
                        {
                            key: 'translation',
                            label: <Link href={"/dashboard/translation"}>Translation</Link>,
                            icon: <TranslationOutlined />,
                        },
                        {
                            key: 'logs',
                            label: <Link href={"/dashboard/logs"}>System Logs</Link>,
                            icon: <SettingOutlined />,
                        },
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

export default AdminSidebar;