'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from '@/presentation/components/common/PageHeader';

interface DonationFormData {
  // Sponsor info
  sponsorType: 'individual' | 'organization';
  name: string;
  organizationName: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;

  // Donation info
  donationType: 'regular' | 'one_time';
  amount: string;
  paymentMethod: string;

  // Receipt info
  receiptRequired: boolean;

  // Agreement
  privacyAgree: boolean;
}

const donationAmounts = [10000, 30000, 50000, 100000];

function DonationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    sponsorType: 'individual',
    name: user?.name || '',
    organizationName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    postcode: '',
    donationType: 'regular',
    amount: '',
    paymentMethod: 'bank_transfer',
    receiptRequired: false,
    privacyAgree: false
  });

  // Handle URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const amount = searchParams.get('amount');

    if (type && (type === 'regular' || type === 'one_time')) {
      setFormData(prev => ({ ...prev, donationType: type }));
    }

    if (amount && amount !== 'custom') {
      const amountValue = parseInt(amount);
      if (!isNaN(amountValue) && amountValue > 0) {
        setFormData(prev => ({ ...prev, amount: amountValue.toString() }));
      }
    }
  }, [searchParams]);

  const handleAmountClick = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.privacyAgree) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      alert('후원 금액을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // First create sponsor
      const sponsorResponse = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sponsorType: formData.sponsorType,
          name: formData.name,
          organizationName: formData.sponsorType === 'organization' ? formData.organizationName : null,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          postcode: formData.postcode,
          receiptRequired: formData.receiptRequired,
          privacyAgree: formData.privacyAgree
        }),
      });

      if (!sponsorResponse.ok) {
        const error = await sponsorResponse.json();
        throw new Error(error.error || 'Failed to create sponsor');
      }

      const sponsor = await sponsorResponse.json();

      // Then create donation
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sponsorId: sponsor.id,
          donationType: formData.donationType,
          amount: parseInt(formData.amount),
          paymentMethod: formData.paymentMethod,
          paymentDate: new Date().toISOString()
        }),
      });

      if (!donationResponse.ok) {
        const error = await donationResponse.json();
        throw new Error(error.error || 'Failed to create donation');
      }

      alert('후원 신청이 완료되었습니다. 감사합니다!');
      router.push('/donation/complete');
    } catch (error: any) {
      console.error('Error submitting donation:', error);
      alert(error.message || '후원 신청에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-donation-apply.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "후원하기" }, { label: "후원신청" }]}
            variant="light"
          />
        </PageHeader>

        {/* Donation Form */}
        <div className="mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {/* Sponsor Type */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">후원자 구분</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sponsorType"
                    value="individual"
                    checked={formData.sponsorType === 'individual'}
                    onChange={(e) => setFormData({ ...formData, sponsorType: e.target.value as any })}
                    className="mr-2"
                  />
                  <span>개인</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sponsorType"
                    value="organization"
                    checked={formData.sponsorType === 'organization'}
                    onChange={(e) => setFormData({ ...formData, sponsorType: e.target.value as any })}
                    className="mr-2"
                  />
                  <span>단체</span>
                </label>
              </div>
            </div>

            {/* Sponsor Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">후원자 정보</h3>
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

                {formData.sponsorType === 'organization' && (
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                      단체명 *
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.sponsorType === 'organization'}
                    />
                  </div>
                )}

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
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    주소
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Donation Type */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">후원 방법</h3>
              <div className="flex space-x-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="donationType"
                    value="regular"
                    checked={formData.donationType === 'regular'}
                    onChange={(e) => setFormData({ ...formData, donationType: e.target.value as any })}
                    className="mr-2"
                  />
                  <span>정기후원</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="donationType"
                    value="one_time"
                    checked={formData.donationType === 'one_time'}
                    onChange={(e) => setFormData({ ...formData, donationType: e.target.value as any })}
                    className="mr-2"
                  />
                  <span>일시후원</span>
                </label>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  후원 금액 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`py-2 px-4 rounded-md border ${formData.amount === amount.toString()
                        ? 'bg-primary text-primary-foreground border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {amount.toLocaleString()}원
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="직접 입력"
                  min="1000"
                  required
                />
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">입금 계좌 안내</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-24 text-gray-600 font-medium">은행명</span>
                  <span className="text-gray-900">KB국민은행</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-24 text-gray-600 font-medium">계좌번호</span>
                  <span className="text-xl font-bold text-blue-600">006001-04-353709</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-24 text-gray-600 font-medium">예금주</span>
                  <span className="text-gray-900">사단법인 토브협회</span>
                </div>
              </div>
            </div>

            {/* Receipt */}
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.receiptRequired}
                  onChange={(e) => setFormData({ ...formData, receiptRequired: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm">기부금 영수증 발급을 희망합니다</span>
              </label>
            </div>

            {/* Privacy Agreement */}
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">개인정보 수집 및 이용 동의</h4>
                <p className="text-sm text-gray-600">
                  토브협회는 후원 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• 수집항목: 이름, 연락처, 이메일, 주소, 후원정보</li>
                  <li>• 수집목적: 후원 관리, 기부금 영수증 발급, 후원자 서비스 제공</li>
                  <li>• 보유기간: 후원 종료 후 5년 (세법상 보관 의무)</li>
                </ul>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.privacyAgree}
                  onChange={(e) => setFormData({ ...formData, privacyAgree: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  required
                />
                <span className="text-sm">
                  개인정보 수집 및 이용에 동의합니다. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? '처리 중...' : '후원 신청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function DonationApplyPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    }>
      <DonationForm />
    </Suspense>
  );
}