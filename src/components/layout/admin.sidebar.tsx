'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    DashboardOutlined,
    UserOutlined,
    ShopOutlined,
    MenuOutlined,
    CoffeeOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { startProgress, doneProgress } from '@/utils/nprogress';

type MenuItem = Required<MenuProps>['items'][number];

interface AdminSideBarProps {
    session?: any;
}

const AdminSideBar = ({ session }: AdminSideBarProps) => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const router = useRouter();

    const handleNavigation = (href: string) => {
        startProgress();
        router.push(href);
        doneProgress();
    };

    const role = session?.user?.role;

    let children: MenuItem[] = [];
    if (role === 'ADMIN') {
        children = [
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
            },
            {
                key: "menu.items",
                label: <span onClick={() => handleNavigation("/dashboard/menu.items")}>Manage Menu Items</span>,
                icon: <CoffeeOutlined />,
            },
            {
                key: "menu.item.option",
                label: <span onClick={() => handleNavigation("/dashboard/menu.item.option")}>Manage Menu Item Option</span>,
                icon: <PlusCircleOutlined />,
            },
        ];
    } else if (role === 'USERS') {
        children = [
            {
                key: "restaurants",
                label: <span onClick={() => handleNavigation("/dashboard/restaurant")}>Manage Restaurants</span>,
                icon: <ShopOutlined />,
            },
            {
                key: "menus",
                label: <span onClick={() => handleNavigation("/dashboard/menus")}>Manage Menus</span>,
                icon: <MenuOutlined />,
            },
            {
                key: "menu.items",
                label: <span onClick={() => handleNavigation("/dashboard/menu.items")}>Manage Menu Items</span>,
                icon: <CoffeeOutlined />,
            },
            {
                key: "menu.item.option",
                label: <span onClick={() => handleNavigation("/dashboard/menu.item.option")}>Manage Menu Item Option</span>,
                icon: <PlusCircleOutlined />,
            },
        ];
    } else if (role === 'OWNER') {
        children = [
            {
                key: "owner.restaurant",
                label: <span onClick={() => handleNavigation("/dashboard/owner.restaurant")}>Manage My Restaurant</span>,
                icon: <ShopOutlined />,
            },
            {
                key: "owner.menus",
                label: <span onClick={() => handleNavigation("/dashboard/owner.menus")}>Manage My Menu</span>,
                icon: <MenuOutlined />,
            },
            {
                key: "owner.menu.item",
                label: <span onClick={() => handleNavigation("/dashboard/owner.menu.item")}>Manage My Menu Item</span>,
                icon: <CoffeeOutlined />,
            },
            {
                key: "owner.menu.item.option",
                label: <span onClick={() => handleNavigation("/dashboard/owner.menu.item.option")}>Manage My Menu Item Option</span>,
                icon: <PlusCircleOutlined />,
            },
            {
                key: "owner.order",
                label: <span onClick={() => handleNavigation("/dashboard/owner.order")}>Manage My Order</span>,
                icon: <ShoppingCartOutlined />,
            },
        ];
    }

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'EMT',
            type: 'group',
            children,
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
            width={250}
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