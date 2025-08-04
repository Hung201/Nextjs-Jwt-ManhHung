import { auth } from '@/auth';
import { AdminContent, AdminFooter, AdminHeader, AdminSidebar } from '@/components/features/layout/admin';
import { AdminContextProvider } from '@/library/admin.context';

const AdminLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth()
    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <AdminSidebar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <AdminHeader session={session} />
                    <AdminContent>
                        {children}
                    </AdminContent>
                    <AdminFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default AdminLayout