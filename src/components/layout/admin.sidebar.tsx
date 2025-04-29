'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    DashboardOutlined,
    UserOutlined,
    ShopOutlined,
    MenuOutlined,
    CoffeeOutlined,
    PlusCircleOutlined
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
                    icon: <DashboardOutlined />,
                },
                {
                    key: "users",
                    label: <span onClick={() => handleNavigation("/dashboard/user")}>Manage Users</span>,
                    icon: <UserOutlined />,
                },
                {
                    key: "restaurants",
                    label: <span onClick={() => handleNavigation("/dashboard/restaurant")}>Manage Restaurants</span>,
                    icon: <ShopOutlined />,
                },
                {
                    key: "menus",
                    label: <span onClick={() => handleNavigation("/dashboard/menus")}>Manage Menus</span>,
                    icon: <MenuOutlined />,
                }
                ,
                {
                    key: "menu.items",
                    label: <span onClick={() => handleNavigation("/dashboard/menu.items")}>Manage Menu Items</span>,
                    icon: <CoffeeOutlined />,
                },
                {
                    key: "menu.item.option",
                    label: <span onClick={() => handleNavigation("/dashboard/menu.item.option")}>Manage Menu Item Option</span>,
                    icon: <PlusCircleOutlined />,
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