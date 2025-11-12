'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, Building, Lock, Save } from 'lucide-react'
import { useAuth } from '@/presentation/contexts/AuthContext'

export default function AdminProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: ''
  })
  const [loading, setLoading] = useState(true)

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: user?.name || '',
          email: user?.email || '',
          phone: data.profile?.phone || '',
          department: data.profile?.churchName || '사무국',
          position: data.profile?.position || '시스템 관리자',
          joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', '') : ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: profile.phone,
          churchName: profile.department,
          position: profile.position
        })
      })
      
      if (response.ok) {
        alert('프로필이 업데이트되었습니다.')
      } else {
        alert('프로필 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('프로필 저장 중 오류가 발생했습니다.')
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new
        })
      })
      
      if (response.ok) {
        alert('비밀번호가 변경되었습니다.')
        setPasswordForm({ current: '', new: '', confirm: '' })
      } else {
        const error = await response.json()
        alert(error.message || '비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      alert('비밀번호 변경 중 오류가 발생했습니다.')
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
              className="w-full px-3 py-2 border rounded bg-gray-100"
              readOnly
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
              className="w-full px-3 py-2 border rounded bg-gray-100"
              readOnly
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
              소속
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
            <label className="block text-sm font-medium mb-1">가입일</label>
            <input
              type="text"
              value={profile.joinDate}
              className="w-full px-3 py-2 border rounded bg-gray-100"
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  )
}
