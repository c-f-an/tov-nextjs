import { Suspense } from "react";
import { AdminLayout } from "@/presentation/components/admin/AdminLayout";

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
