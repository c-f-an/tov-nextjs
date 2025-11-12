import { AdminLayout } from '@/presentation/components/admin/AdminLayout';

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
