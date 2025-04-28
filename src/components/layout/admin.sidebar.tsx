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
                    key: "menus",
                    label: <span onClick={() => handleNavigation("/dashboard/menus")}>Manage Menus</span>,
                    icon: <TeamOutlined />,
                }
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