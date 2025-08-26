'use client'

import { useState } from 'react'
import { Search, Download, Mail, Filter } from 'lucide-react'
import { AdminLayout } from '@/presentation/components/admin/AdminLayout'

interface Sponsor {
  id: number
  name: string
  email: string
  phone: string
  type: '정기' | '일시'
  amount: number
  totalAmount: number
  startDate: string
  lastDonation: string
  status: '활성' | '중단' | '해지'
}

const mockSponsors: Sponsor[] = [
  {
    id: 1,
    name: '김철수',
    email: 'kim@email.com',
    phone: '010-1234-5678',
    type: '정기',
    amount: 30000,
    totalAmount: 360000,
    startDate: '2023.01.15',
    lastDonation: '2024.03.01',
    status: '활성'
  },
  {
    id: 2,
    name: '이영희',
    email: 'lee@email.com',
    phone: '010-2345-6789',
    type: '정기',
    amount: 50000,
    totalAmount: 600000,
    startDate: '2023.01.01',
    lastDonation: '2024.03.01',
    status: '활성'
  },
  {
    id: 3,
    name: '박민수',
    email: 'park@email.com',
    phone: '010-3456-7890',
    type: '일시',
    amount: 100000,
    totalAmount: 100000,
    startDate: '2024.02.15',
    lastDonation: '2024.02.15',
    status: '활성'
  }
]

export default function AdminSponsorsPage() {
  const [sponsors] = useState<Sponsor[]>(mockSponsors)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'전체' | '정기' | '일시'>('전체')
  const [filterStatus, setFilterStatus] = useState<'전체' | '활성' | '중단' | '해지'>('전체')

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.includes(searchTerm) || 
                         sponsor.email.includes(searchTerm) ||
                         sponsor.phone.includes(searchTerm)
    const matchesType = filterType === '전체' || sponsor.type === filterType
    const matchesStatus = filterStatus === '전체' || sponsor.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalAmount = filteredSponsors.reduce((sum, s) => sum + s.totalAmount, 0)
  const activeCount = filteredSponsors.filter(s => s.status === '활성').length

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">후원자 목록</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Mail className="h-4 w-4" />
              단체 메일 발송
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              엑셀 다운로드
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">전체 후원자</p>
            <p className="text-2xl font-bold">{sponsors.length}명</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">활성 후원자</p>
            <p className="text-2xl font-bold">{activeCount}명</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">총 후원금액</p>
            <p className="text-2xl font-bold">{totalAmount.toLocaleString()}원</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">월 평균 후원금</p>
            <p className="text-2xl font-bold">
              {Math.floor(totalAmount / 12).toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1 border rounded"
              >
                <option value="전체">전체 유형</option>
                <option value="정기">정기후원</option>
                <option value="일시">일시후원</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1 border rounded"
              >
                <option value="전체">전체 상태</option>
                <option value="활성">활성</option>
                <option value="중단">중단</option>
                <option value="해지">해지</option>
              </select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="이름, 이메일, 전화번호로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 후원자 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">이름</th>
                <th className="text-left py-3 px-4">연락처</th>
                <th className="text-center py-3 px-4">후원유형</th>
                <th className="text-right py-3 px-4">월 후원금</th>
                <th className="text-right py-3 px-4">누적 후원금</th>
                <th className="text-center py-3 px-4">시작일</th>
                <th className="text-center py-3 px-4">최근 후원</th>
                <th className="text-center py-3 px-4">상태</th>
                <th className="text-center py-3 px-4">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredSponsors.map((sponsor) => (
                <tr key={sponsor.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <p className="text-sm text-gray-600">{sponsor.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{sponsor.phone}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      sponsor.type === '정기' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sponsor.type}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    {sponsor.amount.toLocaleString()}원
                  </td>
                  <td className="text-right py-3 px-4 font-medium">
                    {sponsor.totalAmount.toLocaleString()}원
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    {sponsor.startDate}
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    {sponsor.lastDonation}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      sponsor.status === '활성' 
                        ? 'bg-green-100 text-green-700'
                        : sponsor.status === '중단'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {sponsor.status}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <button className="text-blue-600 hover:underline text-sm">
                      상세보기
                    </button>
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