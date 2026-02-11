'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  paymentMethod: 'bank_transfer' | 'cms'; // 일반 계좌이체 | CMS 자동이체

  // CMS specific fields
  cmsBank: string; // 출금은행명
  cmsAccountNumber: string; // 출금 계좌번호
  cmsAccountHolder: string; // 예금주 성명
  cmsWithdrawalDay: string; // 출금일

  // Receipt info
  receiptRequired: boolean;
  residentRegistrationNumber: string; // 주민번호 13자리 (기부금 영수증 발급시)

  // Message
  message: string; // 하고 싶은 말씀

  // Agreement
  privacyAgree: boolean;
}

const donationAmounts = [10000, 30000, 50000, 100000];

function DonationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken } = useAuth();
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
    paymentMethod: 'cms', // 정기후원 기본값이므로 CMS로 설정
    cmsBank: '',
    cmsAccountNumber: '',
    cmsAccountHolder: '',
    cmsWithdrawalDay: '25',
    receiptRequired: false,
    residentRegistrationNumber: '',
    message: '',
    privacyAgree: false
  });

  // Fetch user profile and populate form data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && accessToken) {
        try {
          const response = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              name: data.name || prev.name,
              email: data.email || prev.email,
              phone: data.phone || prev.phone,
              address: data.profile?.address || prev.address,
              postcode: data.profile?.postcode || prev.postcode
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user, accessToken]);

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

    // CMS 자동이체 선택 시 필수 필드 검증
    if (formData.paymentMethod === 'cms') {
      if (!formData.cmsBank) {
        alert('출금은행명을 선택해주세요.');
        return;
      }
      if (!formData.cmsAccountNumber) {
        alert('출금 계좌번호를 입력해주세요.');
        return;
      }
      if (!formData.cmsAccountHolder) {
        alert('예금주 성명을 입력해주세요.');
        return;
      }
    }

    // 기부금 영수증 발급 선택 시 주민번호 검증
    if (formData.receiptRequired) {
      if (!formData.residentRegistrationNumber) {
        alert('기부금 영수증 발급을 위해 주민등록번호를 입력해주세요.');
        return;
      }
      if (formData.residentRegistrationNumber.length !== 13) {
        alert('주민등록번호 13자리를 정확히 입력해주세요.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let sponsor;

      // Check if user already has a sponsor
      if (user && accessToken) {
        const existingSponsorResponse = await fetch('/api/user/sponsors', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (existingSponsorResponse.ok) {
          const data = await existingSponsorResponse.json();
          sponsor = data.sponsor;
        }
      }

      // If no existing sponsor, create a new one
      if (!sponsor) {
        const sponsorResponse = await fetch('/api/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
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
            residentRegistrationNumber: formData.receiptRequired ? formData.residentRegistrationNumber : null,
            privacyAgree: formData.privacyAgree
          }),
        });

        if (!sponsorResponse.ok) {
          const error = await sponsorResponse.json();
          throw new Error(error.error || 'Failed to create sponsor');
        }

        sponsor = await sponsorResponse.json();
      }

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
          paymentDate: new Date().toISOString(),
          // CMS 관련 정보 (CMS 선택 시에만)
          cmsBank: formData.paymentMethod === 'cms' ? formData.cmsBank : null,
          cmsAccountNumber: formData.paymentMethod === 'cms' ? formData.cmsAccountNumber : null,
          cmsAccountHolder: formData.paymentMethod === 'cms' ? formData.cmsAccountHolder : null,
          cmsWithdrawalDay: formData.paymentMethod === 'cms' ? formData.cmsWithdrawalDay : null,
          // 메시지
          message: formData.message
        }),
      });

      if (!donationResponse.ok) {
        const error = await donationResponse.json();
        throw new Error(error.error || 'Failed to create donation');
      }

      alert('후원 신청이 완료되었습니다. 감사합니다!');
      router.push('/mypage');
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
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    required
                    disabled
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
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="010-0000-0000"
                    required
                    disabled
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
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    required
                    disabled
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
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
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
                    onChange={() => setFormData({
                      ...formData,
                      donationType: 'regular',
                      paymentMethod: 'cms' // 정기후원은 CMS 자동이체
                    })}
                    className="mr-2"
                  />
                  <span>정기후원 (CMS 자동이체)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="donationType"
                    value="one_time"
                    checked={formData.donationType === 'one_time'}
                    onChange={() => setFormData({
                      ...formData,
                      donationType: 'one_time',
                      paymentMethod: 'bank_transfer' // 일시후원은 일반 계좌이체
                    })}
                    className="mr-2"
                  />
                  <span>일시후원 (일반 계좌이체)</span>
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

            {/* Bank Account Info (일반 계좌이체) */}
            {formData.paymentMethod === 'bank_transfer' && (
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
            )}

            {/* CMS Account Info (CMS 자동이체) */}
            {formData.paymentMethod === 'cms' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">출금 계좌 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cmsBank" className="block text-sm font-medium text-gray-700 mb-2">
                      출금은행명 *
                    </label>
                    <select
                      id="cmsBank"
                      value={formData.cmsBank}
                      onChange={(e) => setFormData({ ...formData, cmsBank: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.paymentMethod === 'cms'}
                    >
                      <option value="">은행 선택</option>
                      <option value="KB국민은행">KB국민은행</option>
                      <option value="신한은행">신한은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="하나은행">하나은행</option>
                      <option value="NH농협은행">NH농협은행</option>
                      <option value="IBK기업은행">IBK기업은행</option>
                      <option value="SC제일은행">SC제일은행</option>
                      <option value="한국씨티은행">한국씨티은행</option>
                      <option value="카카오뱅크">카카오뱅크</option>
                      <option value="케이뱅크">케이뱅크</option>
                      <option value="토스뱅크">토스뱅크</option>
                      <option value="새마을금고">새마을금고</option>
                      <option value="신협">신협</option>
                      <option value="우체국">우체국</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cmsAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      출금 계좌번호 *
                    </label>
                    <input
                      type="text"
                      id="cmsAccountNumber"
                      value={formData.cmsAccountNumber}
                      onChange={(e) => setFormData({ ...formData, cmsAccountNumber: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="'-' 없이 입력"
                      required={formData.paymentMethod === 'cms'}
                    />
                  </div>

                  <div>
                    <label htmlFor="cmsAccountHolder" className="block text-sm font-medium text-gray-700 mb-2">
                      예금주 성명 *
                    </label>
                    <input
                      type="text"
                      id="cmsAccountHolder"
                      value={formData.cmsAccountHolder}
                      onChange={(e) => setFormData({ ...formData, cmsAccountHolder: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.paymentMethod === 'cms'}
                    />
                  </div>

                  <div>
                    <label htmlFor="cmsWithdrawalDay" className="block text-sm font-medium text-gray-700 mb-2">
                      출금일 *
                    </label>
                    <select
                      id="cmsWithdrawalDay"
                      value={formData.cmsWithdrawalDay}
                      onChange={(e) => setFormData({ ...formData, cmsWithdrawalDay: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.paymentMethod === 'cms'}
                    >
                      <option value="10">매월 10일</option>
                      <option value="15">매월 15일</option>
                      <option value="20">매월 20일</option>
                      <option value="25">매월 25일</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  <p className="text-sm text-gray-700">
                    <strong>안내사항:</strong> CMS 자동이체는 선택하신 출금일에 자동으로 후원금이 출금됩니다.
                    출금일이 휴일인 경우 다음 영업일에 출금됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* Receipt */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">기부금 영수증 발급</h3>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.receiptRequired}
                  onChange={(e) => setFormData({ ...formData, receiptRequired: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm">기부금 영수증 발급을 희망합니다</span>
              </label>

              {formData.receiptRequired && (
                <div className="mt-4">
                  <label htmlFor="residentRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    주민등록번호 13자리 *
                  </label>
                  <input
                    type="text"
                    id="residentRegistrationNumber"
                    value={formData.residentRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, residentRegistrationNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="'-' 없이 13자리 입력"
                    maxLength={13}
                    required={formData.receiptRequired}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    기부금 영수증 발급을 위해 주민등록번호가 필요합니다. 입력하신 정보는 안전하게 보호됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                하고 싶은 말씀
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="토브협회에 전하고 싶은 말씀을 자유롭게 작성해주세요."
              />
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