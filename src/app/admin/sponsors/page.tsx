'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Mail, Filter } from 'lucide-react'
import { AdminLayout } from '@/presentation/components/admin/AdminLayout'

interface Sponsor {
  id: number
  userId: number
  userName: string
  userEmail: string
  userPhone: string | null
  sponsorType: string
  amount: number
  totalAmount: number
  startDate: string
  lastPaymentDate: string | null
  sponsorStatus: string
  paymentCount: number
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'onetime'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    try {
      const response = await fetch('/api/admin/sponsors')
      if (response.ok) {
        const data = await response.json()
        setSponsors(data.sponsors)
      }
    } catch (error) {
      console.error('Failed to fetch sponsors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sponsor.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.userPhone?.includes(searchTerm)
    const matchesType = filterType === 'all' || sponsor.sponsorType === filterType
    const matchesStatus = filterStatus === 'all' || sponsor.sponsorStatus === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalAmount = filteredSponsors.reduce((sum, s) => sum + s.totalAmount, 0)
  const activeCount = filteredSponsors.filter(s => s.sponsorStatus === 'active').length

  const getTypeDisplay = (type: string) => {
    return type === 'regular' ? '정기' : '일시'
  }

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'active': return '활성'
      case 'paused': return '중단'
      case 'cancelled': return '해지'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">후원자 관리</h1>
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
            <p className="text-sm text-gray-600">이번 달 후원금</p>
            <p className="text-2xl font-bold">
              {filteredSponsors
                .filter(s => s.sponsorStatus === 'active' && s.sponsorType === 'regular')
                .reduce((sum, s) => sum + s.amount, 0)
                .toLocaleString()}원
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">총 누적 후원금</p>
            <p className="text-2xl font-bold">
              {totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">전체 유형</option>
              <option value="regular">정기후원</option>
              <option value="onetime">일시후원</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="paused">중단</option>
              <option value="cancelled">해지</option>
            </select>
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
                <th className="text-left py-3 px-4">후원자 정보</th>
                <th className="text-left py-3 px-4">연락처</th>
                <th className="text-center py-3 px-4">후원 유형</th>
                <th className="text-right py-3 px-4">월 후원액</th>
                <th className="text-right py-3 px-4">누적 후원액</th>
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
                      <p className="font-medium">{sponsor.userName}</p>
                      <p className="text-sm text-gray-600">{sponsor.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{sponsor.userPhone || '-'}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      sponsor.sponsorType === 'regular'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getTypeDisplay(sponsor.sponsorType)}
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
                    {sponsor.lastPaymentDate || '-'}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(sponsor.sponsorStatus)}`}>
                      {getStatusDisplay(sponsor.sponsorStatus)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
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