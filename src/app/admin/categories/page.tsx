'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import AdminLayout from '@/presentation/components/layout/AdminLayout'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  postCount: number
}

const mockCategories: Category[] = [
  { id: 1, name: '공지사항', slug: 'notice', description: '토브협회의 공지사항입니다.', postCount: 15 },
  { id: 2, name: '토브소식', slug: 'news', description: '토브협회의 최신 소식을 전합니다.', postCount: 23 },
  { id: 3, name: '언론보도', slug: 'media', description: '토브협회 관련 언론 보도자료입니다.', postCount: 8 },
  { id: 4, name: '발간자료', slug: 'publication', description: '토브협회에서 발간한 자료들입니다.', postCount: 12 },
  { id: 5, name: '자료실', slug: 'resource', description: '토브협회 관련 자료들입니다.', postCount: 45 },
  { id: 6, name: '활동소식', slug: 'activity', description: '토브협회 활동 소식입니다.', postCount: 19 }
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, description: category.description })
  }

  const handleSave = (id: number) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: editForm.name, description: editForm.description }
        : cat
    ))
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  const handleAdd = () => {
    if (newCategory.name && newCategory.slug) {
      setCategories([...categories, {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...newCategory,
        postCount: 0
      }])
      setNewCategory({ name: '', slug: '', description: '' })
      setIsAdding(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">카테고리 관리</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            새 카테고리
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">카테고리명</th>
                <th className="text-left py-3 px-4">슬러그</th>
                <th className="text-left py-3 px-4">설명</th>
                <th className="text-center py-3 px-4">게시글 수</th>
                <th className="text-center py-3 px-4">관리</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="카테고리명"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="slug"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="설명"
                    />
                  </td>
                  <td className="text-center py-3 px-4">0</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={handleAdd}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{category.slug}</td>
                  <td className="py-3 px-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-gray-600">{category.description}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">{category.postCount}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => handleSave(category.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
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