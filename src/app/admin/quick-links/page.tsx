'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'

interface QuickLink {
  id: number
  title: string
  icon: string | null
  linkUrl: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminQuickLinksPage() {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    linkUrl: '',
    description: '',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    fetchQuickLinks()
  }, [])

  const fetchQuickLinks = async () => {
    try {
      const response = await fetch('/api/admin/quick-links')
      if (response.ok) {
        const data = await response.json()
        setQuickLinks(data.quickLinks)
      }
    } catch (error) {
      console.error('Failed to fetch quick links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (link?: QuickLink) => {
    if (link) {
      setEditingLink(link)
      setFormData({
        title: link.title,
        icon: link.icon || '',
        linkUrl: link.linkUrl,
        description: link.description || '',
        sortOrder: link.sortOrder,
        isActive: link.isActive
      })
    } else {
      setEditingLink(null)
      setFormData({
        title: '',
        icon: '',
        linkUrl: '',
        description: '',
        sortOrder: quickLinks.length,
        isActive: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLink(null)
    setFormData({
      title: '',
      icon: '',
      linkUrl: '',
      description: '',
      sortOrder: 0,
      isActive: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingLink
        ? `/api/admin/quick-links/${editingLink.id}`
        : '/api/admin/quick-links'

      const method = editingLink ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchQuickLinks()
        handleCloseModal()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save quick link')
      }
    } catch (error) {
      console.error('Error saving quick link:', error)
      alert('Failed to save quick link')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 퀵링크를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/quick-links/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchQuickLinks()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete quick link')
      }
    } catch (error) {
      console.error('Error deleting quick link:', error)
      alert('Failed to delete quick link')
    }
  }

  const handleToggleActive = async (link: QuickLink) => {
    try {
      const response = await fetch(`/api/admin/quick-links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...link,
          isActive: !link.isActive
        })
      })

      if (response.ok) {
        await fetchQuickLinks()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
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
      <h1 className="text-2xl font-bold">주요 서비스 관리</h1>
      <button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        새 퀵링크 추가
      </button>
    </div>

    {/* 통계 카드 */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">전체 퀵링크</p>
        <p className="text-2xl font-bold">{quickLinks.length}개</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">활성 퀵링크</p>
        <p className="text-2xl font-bold">
          {quickLinks.filter(l => l.isActive).length}개
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">비활성 퀵링크</p>
        <p className="text-2xl font-bold">
          {quickLinks.filter(l => !l.isActive).length}개
        </p>
      </div>
    </div>

    {/* 퀵링크 테이블 */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 w-12">순서</th>
            <th className="text-left py-3 px-4">아이콘</th>
            <th className="text-left py-3 px-4">제목</th>
            <th className="text-left py-3 px-4">URL</th>
            <th className="text-left py-3 px-4">설명</th>
            <th className="text-center py-3 px-4">상태</th>
            <th className="text-center py-3 px-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {quickLinks.map((link) => (
            <tr key={link.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{link.sortOrder}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                {link.icon ? (
                  <span className="text-2xl">{link.icon}</span>
                ) : (
                  <span className="text-gray-400 text-sm">없음</span>
                )}
              </td>
              <td className="py-3 px-4">
                <p className="font-medium">{link.title}</p>
              </td>
              <td className="py-3 px-4">
                <a
                  href={link.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {link.linkUrl}
                </a>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-600 truncate max-w-xs">
                  {link.description || '-'}
                </p>
              </td>
              <td className="text-center py-3 px-4">
                <button
                  onClick={() => handleToggleActive(link)}
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    link.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {link.isActive ? (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      활성
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      비활성
                    </span>
                  )}
                </button>
              </td>
              <td className="text-center py-3 px-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenModal(link)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="수정"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {quickLinks.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">
                등록된 퀵링크가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* 모달 */}
    {showModal && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingLink ? '퀵링크 수정' : '새 퀵링크 추가'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                아이콘 (이모지)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="예: 📚"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                링크 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="예: /resources"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="퀵링크에 대한 간단한 설명"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                정렬 순서
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                활성화
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {editingLink ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
    )}
    </div>
  )
}
