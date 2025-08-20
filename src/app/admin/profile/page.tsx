'use client'

import { useState } from 'react'
import { User, Mail, Phone, Building, Lock, Save } from 'lucide-react'
import AdminLayout from '@/presentation/components/layout/AdminLayout'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: '김관리',
    email: 'admin@tov.or.kr',
    phone: '010-9999-9999',
    department: '사무국',
    position: '시스템 관리자',
    joinDate: '2022.01.01'
  })

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleProfileSave = () => {
    alert('프로필이 업데이트되었습니다.')
  }

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    alert('비밀번호가 변경되었습니다.')
    setPasswordForm({ current: '', new: '', confirm: '' })
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">프로필 설정</h1>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.position}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <User className="inline h-4 w-4 mr-1" />
                이름
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                이메일
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="inline h-4 w-4 mr-1" />
                연락처
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Building className="inline h-4 w-4 mr-1" />
                부서
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({...profile, department: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">직책</label>
              <input
                type="text"
                value={profile.position}
                onChange={(e) => setProfile({...profile, position: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">입사일</label>
              <input
                type="text"
                value={profile.joinDate}
                className="w-full px-3 py-2 border rounded bg-gray-50"
                readOnly
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleProfileSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              프로필 저장
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            비밀번호 변경
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">새 비밀번호</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 활동 기록 */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">최근 활동 기록</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">게시글 작성</span>
              <span className="text-sm text-gray-600">2024.03.21 10:30</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">회원 정보 수정</span>
              <span className="text-sm text-gray-600">2024.03.20 15:45</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">상담 답변 작성</span>
              <span className="text-sm text-gray-600">2024.03.19 14:20</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">사이트 설정 변경</span>
              <span className="text-sm text-gray-600">2024.03.18 11:00</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}