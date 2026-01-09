'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isActive: boolean
  postCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeInactive=true')
      if (response.ok) {
        const data = await response.json()
        // Add post count for each category
        const categoriesWithCount = await Promise.all(data.map(async (cat: any) => {
          const postsResponse = await fetch(`/api/posts?categoryId=${cat.id}&limit=1`)
          const postsData = await postsResponse.json()
          return {
            ...cat,
            postCount: postsData.total || 0
          }
        }))
        setCategories(categoriesWithCount)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, description: category.description || '' })
  }

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        await fetchCategories()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까? 이 카테고리의 모든 게시물도 함께 삭제됩니다.')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchCategories()
        }
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleAdd = async () => {
    if (newCategory.name && newCategory.slug) {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newCategory,
            parentId: null,
            sortOrder: categories.length + 1,
            isActive: true
          })
        })
        
        if (response.ok) {
          await fetchCategories()
          setNewCategory({ name: '', slug: '', description: '' })
          setIsAdding(false)
        }
      } catch (error) {
        console.error('Failed to add category:', error)
      }
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
        <h1 className="text-2xl font-bold">카테고리 관리</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          새 카테고리
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">카테고리명</th>
              <th className="text-left p-4">슬러그</th>
              <th className="text-left p-4">설명</th>
              <th className="text-center p-4">게시물 수</th>
              <th className="text-center p-4">상태</th>
              <th className="text-center p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="border-b">
                <td className="p-4">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="카테고리명"
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                    placeholder="slug"
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="설명"
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="text-center p-4">0</td>
                <td className="text-center p-4">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">활성</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={handleAdd} className="text-green-600 hover:bg-green-50 p-1 rounded">
                      <Save className="h-4 w-4" />
                    </button>
                    <button onClick={() => setIsAdding(false)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="p-4 text-sm text-gray-600">{category.slug}</td>
                <td className="p-4">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{category.description || '-'}</span>
                  )}
                </td>
                <td className="text-center p-4">
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                    {category.postCount}
                  </span>
                </td>
                <td className="text-center p-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    category.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {category.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {editingId === category.id ? (
                      <>
                        <button onClick={() => handleSave(category.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                          <Save className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-600 hover:bg-gray-50 p-1 rounded">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(category)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
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
  )
}
