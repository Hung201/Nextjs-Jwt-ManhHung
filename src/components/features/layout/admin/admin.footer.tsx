'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Hung ©{new Date().getFullYear()} Created by @hung
            </Footer>
        </>
    )
}

export default AdminFooter;