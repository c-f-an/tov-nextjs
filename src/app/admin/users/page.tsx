'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, Mail, Shield, UserX, Edit, CheckSquare, Square, MoreVertical } from 'lucide-react'
import { UserDetailModal } from '@/presentation/components/admin/UserDetailModal'
import { CreateUserModal } from '@/presentation/components/admin/CreateUserModal'
import { BulkEmailModal } from '@/presentation/components/admin/BulkEmailModal'
import { BulkSuspendModal } from '@/presentation/components/admin/BulkSuspendModal'

interface User {
  id: number
  name: string
  email: string
  phone: string
  username: string
  status: string
  joinDate: string
  lastLogin: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false)
  const [isBulkSuspendModalOpen, setIsBulkSuspendModalOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'active': return '활성'
      case 'inactive': return '비활성'
      case 'suspended': return '정지'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'suspended': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId)
    setIsDetailModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedUserId(null)
    setIsDetailModalOpen(false)
  }

  const handleModalUpdate = () => {
    fetchUsers() // Refresh the user list after update
  }

  const handleSelectUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(filteredUsers.map(user => user.id))
    }
  }

  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length
  const isPartiallySelected = selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length

  const handleBulkStatusChange = async (status: string) => {
    if (selectedUserIds.length === 0) return

    // For suspension, open the suspend modal
    if (status === 'suspended') {
      setIsBulkSuspendModalOpen(true)
      return
    }

    if (!window.confirm(`선택한 ${selectedUserIds.length}명의 회원 상태를 ${status === 'active' ? '활성' : '비활성'}(으)로 변경하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUserIds,
          action: 'UPDATE_STATUS',
          status,
        }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      const data = await response.json()
      alert(`${data.results.success}명의 회원 상태가 변경되었습니다.`)
      setSelectedUserIds([])
      fetchUsers()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return

    if (!window.confirm(`정말로 선택한 ${selectedUserIds.length}명의 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUserIds,
        }),
      })

      if (!response.ok) throw new Error('Failed to delete users')

      const data = await response.json()
      alert(`${data.results.success}명의 회원이 삭제되었습니다.`)
      setSelectedUserIds([])
      fetchUsers()
    } catch (error) {
      console.error('Error deleting users:', error)
      alert('회원 삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )
  }

  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">회원 관리</h1>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700"
      >
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
          {users.filter(u => u.status === 'active').length}명
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">비활성 회원</p>
        <p className="text-2xl font-bold">
          {users.filter(u => u.status === 'inactive').length}명
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">정지 회원</p>
        <p className="text-2xl font-bold">
          {users.filter(u => u.status === 'suspended').length}명
        </p>
      </div>
    </div>

    {/* 필터 및 검색 */}
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex gap-4 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="suspended">정지</option>
        </select>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 이메일, 사용자명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>

    {/* 일괄 작업 도구 모음 */}
    {selectedUserIds.length > 0 && (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              {selectedUserIds.length}명 선택됨
            </span>
            <button
              onClick={() => setSelectedUserIds([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              선택 해제
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkEmailModalOpen(true)}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" />
              메일 발송
            </button>
            <div className="relative inline-block">
              <select
                onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:bg-blue-700 appearance-none pr-8 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>상태 변경</option>
                <option value="active">활성으로 변경</option>
                <option value="inactive">비활성으로 변경</option>
                <option value="suspended">정지로 변경</option>
              </select>
              <Shield className="h-3.5 w-3.5 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-white" />
            </div>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1"
            >
              <UserX className="h-3.5 w-3.5" />
              삭제
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 회원 테이블 */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 py-3 px-4">
              <button
                onClick={handleSelectAll}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : isPartiallySelected ? (
                  <div className="relative">
                    <Square className="h-4 w-4 text-gray-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                    </div>
                  </div>
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th className="text-left py-3 px-4">회원정보</th>
            <th className="text-left py-3 px-4">연락처</th>
            <th className="text-center py-3 px-4">가입일</th>
            <th className="text-center py-3 px-4">최근 접속</th>
            <th className="text-center py-3 px-4">상태</th>
            <th className="text-center py-3 px-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="w-12 py-3 px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectUser(user.id)
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {selectedUserIds.includes(user.id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="py-3 px-4">
                <div
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleUserClick(user.id)}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.username && (
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">{user.phone || '-'}</td>
              <td className="text-center py-3 px-4 text-sm">
                {user.joinDate}
              </td>
              <td className="text-center py-3 px-4 text-sm">
                {user.lastLogin || '접속 기록 없음'}
              </td>
              <td className="text-center py-3 px-4">
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(user.status)}`}>
                  {getStatusDisplay(user.status)}
                </span>
              </td>
              <td className="text-center py-3 px-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleUserClick(user.id)}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    title="상세 보기"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUserClick(user.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="메일 발송"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUserClick(user.id)}
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

    {/* User Detail Modal */}
    {selectedUserId && (
    <UserDetailModal
      userId={selectedUserId}
      isOpen={isDetailModalOpen}
      onClose={handleModalClose}
      onUpdate={handleModalUpdate}
    />
    )}

    {/* Create User Modal */}
    <CreateUserModal
    isOpen={isCreateModalOpen}
    onClose={() => setIsCreateModalOpen(false)}
    onSuccess={() => {
      setIsCreateModalOpen(false);
      fetchUsers(); // Refresh the user list
    }}
    />

    {/* Bulk Email Modal */}
    {isBulkEmailModalOpen && (
    <BulkEmailModal
      isOpen={isBulkEmailModalOpen}
      onClose={() => setIsBulkEmailModalOpen(false)}
      userIds={selectedUserIds}
      userCount={selectedUserIds.length}
      onSuccess={() => {
        setIsBulkEmailModalOpen(false)
        setSelectedUserIds([])
      }}
    />
    )}

    {/* Bulk Suspend Modal */}
    {isBulkSuspendModalOpen && (
    <BulkSuspendModal
      isOpen={isBulkSuspendModalOpen}
      onClose={() => setIsBulkSuspendModalOpen(false)}
      userIds={selectedUserIds}
      userCount={selectedUserIds.length}
      onSuccess={() => {
        setIsBulkSuspendModalOpen(false)
        setSelectedUserIds([])
        fetchUsers()
        }}
      />
    )}
    </div>
  )
}
