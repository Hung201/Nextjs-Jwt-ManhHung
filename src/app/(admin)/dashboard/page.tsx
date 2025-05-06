import AdminCard from "@/components/admin/admin.card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const session = await auth();
    if (session?.user?.role === 'OWNER') {
        redirect('/dashboard/owner.restaurant');
    }
    return (
        <div>
            <AdminCard />
        </div>
    )
}

export default DashboardPage;






