'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                EMT ©{new Date().getFullYear()} Created by @emt
            </Footer>
        </>
    )
}

export default AdminFooter;