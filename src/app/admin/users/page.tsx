'use client'

import { useState } from 'react'
import { Search, UserPlus, Mail, Shield, UserX } from 'lucide-react'
import { AdminLayout } from '@/presentation/components/admin/AdminLayout'

interface User {
  id: number
  name: string
  email: string
  phone: string
  church: string
  role: 'USER' | 'ADMIN'
  joinDate: string
  lastLogin: string
  status: '활성' | '비활성' | '정지'
}

const mockUsers: User[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@email.com',
    phone: '010-1234-5678',
    church: '샘플교회',
    role: 'USER',
    joinDate: '2023.01.15',
    lastLogin: '2024.03.20 14:30',
    status: '활성'
  },
  {
    id: 2,
    name: '김관리',
    email: 'admin@tov.or.kr',
    phone: '010-9999-9999',
    church: 'TOV',
    role: 'ADMIN',
    joinDate: '2022.01.01',
    lastLogin: '2024.03.21 09:00',
    status: '활성'
  },
  {
    id: 3,
    name: '이사용',
    email: 'user@email.com',
    phone: '010-5555-5555',
    church: '은혜교회',
    role: 'USER',
    joinDate: '2023.06.20',
    lastLogin: '2024.02.15 16:45',
    status: '활성'
  }
]

export default function AdminUsersPage() {
  const [users] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'전체' | 'USER' | 'ADMIN'>('전체')
  const [filterStatus, setFilterStatus] = useState<'전체' | '활성' | '비활성' | '정지'>('전체')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || 
                         user.email.includes(searchTerm) ||
                         user.church.includes(searchTerm)
    const matchesRole = filterRole === '전체' || user.role === filterRole
    const matchesStatus = filterStatus === '전체' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">회원 관리</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />
            새 회원 추가
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">전체 회원</p>
            <p className="text-2xl font-bold">{users.length}명</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">활성 회원</p>
            <p className="text-2xl font-bold">
              {users.filter(u => u.status === '활성').length}명
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">관리자</p>
            <p className="text-2xl font-bold">
              {users.filter(u => u.role === 'ADMIN').length}명
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">오늘 접속</p>
            <p className="text-2xl font-bold">12명</p>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="전체">전체 권한</option>
              <option value="USER">일반회원</option>
              <option value="ADMIN">관리자</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="전체">전체 상태</option>
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
              <option value="정지">정지</option>
            </select>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="이름, 이메일, 교회명으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 회원 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">회원정보</th>
                <th className="text-left py-3 px-4">연락처</th>
                <th className="text-left py-3 px-4">교회</th>
                <th className="text-center py-3 px-4">권한</th>
                <th className="text-center py-3 px-4">가입일</th>
                <th className="text-center py-3 px-4">최근 접속</th>
                <th className="text-center py-3 px-4">상태</th>
                <th className="text-center py-3 px-4">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.church}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                      {user.role === 'ADMIN' ? '관리자' : '일반'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    {user.joinDate}
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    {user.lastLogin}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.status === '활성' 
                        ? 'bg-green-100 text-green-700'
                        : user.status === '비활성'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="메일 발송"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="계정 정지"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}