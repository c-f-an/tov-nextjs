'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { AdminLayout } from '@/presentation/components/admin/AdminLayout';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  pendingConsultations: number;
  monthlyDonations: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    pendingConsultations: 0,
    monthlyDonations: 0
  });

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [user, router]);

  const fetchDashboardStats = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 1234,
      totalPosts: 567,
      pendingConsultations: 23,
      monthlyDonations: 4567000
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-8">대시보드</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 회원</p>
                <p className="text-2xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+12%</span> 지난달 대비
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">게시글</p>
                <p className="text-2xl font-bold mt-2">{stats.totalPosts.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+23</span> 이번주
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">대기중 상담</p>
                <p className="text-2xl font-bold mt-2">{stats.pendingConsultations}</p>
              </div>
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-yellow-600 mt-4">
              <span className="font-medium">5</span>건 긴급
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">이번달 후원금</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(stats.monthlyDonations)}</p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+8%</span> 지난달 대비
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">최근 게시글</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">게시글 제목 {i}</h3>
                      <p className="text-sm text-gray-500">작성자 • 2시간 전</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      공지사항
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Consultations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">최근 상담 신청</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">상담 제목 {i}</h3>
                      <p className="text-sm text-gray-500">신청자 • 3시간 전</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      대기중
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}