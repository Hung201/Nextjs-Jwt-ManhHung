'use client';
import React, { useEffect } from 'react';
import { Layout } from 'antd';
import HomeHeader from './HomeHeader';
import { configureNProgress } from '@/utils/nprogress';

const { Content } = Layout;

interface HomeLayoutProps {
    children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    useEffect(() => {
        configureNProgress();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <HomeHeader />
            <Content style={{
                padding: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {children}
            </Content>
        </Layout>
    );
};

export default HomeLayout; 