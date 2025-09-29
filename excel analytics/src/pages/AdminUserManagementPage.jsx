import AdminDashboardLayout from "../components/admin/AdminDashboardLayout";
import AdminUserTable from "../components/admin/AdminUserTable";

export default function AdminUserManagementPage() {
  return (
    <AdminDashboardLayout>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <AdminUserTable />
    </AdminDashboardLayout>
  );
}
