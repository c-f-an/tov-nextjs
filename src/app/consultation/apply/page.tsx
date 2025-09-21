'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/presentation/contexts/AuthContext';
import PageHeader from '@/presentation/components/common/PageHeader';

const consultationTypes = [
  { value: 'religious-income', label: '종교인 소득세' },
  { value: 'nonprofit-accounting', label: '비영리 회계' },
  { value: 'settlement-disclosure', label: '결산 공시' },
  { value: 'general', label: '일반 상담' },
  { value: 'other', label: '기타' }
];

export default function ConsultationApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    churchName: '',
    position: '',
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    title: '',
    content: '',
    privacyAgree: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.privacyAgree) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit consultation');
      }

      alert('상담 신청이 완료되었습니다. 담당자가 곧 연락드리겠습니다.');
      router.push('/consultation/list');
    } catch (error: any) {
      console.error('Error submitting consultation:', error);
      alert(error.message || '상담 신청에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">홈</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/consultation" className="hover:text-blue-600">상담센터</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">상담신청</li>
        </ol>
      </nav>

      <PageHeader 
        title="상담 신청"
        description="전문가가 직접 상담해드립니다. 궁금하신 사항을 자유롭게 문의해주세요."
      />

      {/* Consultation Form */}
      <div className="mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">신청자 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                  교회/단체명
                </label>
                <input
                  type="text"
                  id="churchName"
                  value={formData.churchName}
                  onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  직책
                </label>
                <input
                  type="text"
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">상담 내용</h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700 mb-2">
                  상담 분야 *
                </label>
                <select
                  id="consultationType"
                  value={formData.consultationType}
                  onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">선택해주세요</option>
                  {consultationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                    희망 상담일
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    희망 시간대
                  </label>
                  <select
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="morning">오전 (09:00-12:00)</option>
                    <option value="afternoon">오후 (13:00-18:00)</option>
                    <option value="evening">저녁 (18:00-20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  상담 제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상담하실 내용의 제목을 입력해주세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  상담 내용 *
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="상담하실 내용을 자세히 입력해주세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* Privacy Agreement */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium mb-2">개인정보 수집 및 이용 동의</h4>
              <p className="text-sm text-gray-600">
                토브협회는 상담 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 수집항목: 이름, 연락처, 이메일, 교회/단체명, 직책</li>
                <li>• 수집목적: 상담 서비스 제공 및 연락</li>
                <li>• 보유기간: 상담 완료 후 1년</li>
              </ul>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.privacyAgree}
                onChange={(e) => setFormData({ ...formData, privacyAgree: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <span className="ml-2 text-sm">
                개인정보 수집 및 이용에 동의합니다. *
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? '신청 중...' : '상담 신청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}