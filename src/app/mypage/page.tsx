"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  Heart,
  Settings,
  LogOut,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  MessageSquare,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from '@/presentation/components/common/PageHeader';

const menuItems = [
  { icon: User, label: "내 정보", id: "profile" },
  { icon: MessageSquare, label: "상담 내역", id: "consultations" },
  { icon: Heart, label: "후원 내역", id: "donations" },
  { icon: Download, label: "다운로드 내역", id: "downloads" },
  { icon: Settings, label: "설정", id: "settings" },
];

const consultationHistory = [
  {
    id: 1,
    date: "2024.03.15",
    type: "온라인 상담",
    category: "종교인 소득세",
    status: "답변완료",
    title: "비과세 소득 범위 문의",
  },
  {
    id: 2,
    date: "2024.02.28",
    type: "전화 상담",
    category: "법인세",
    status: "답변완료",
    title: "수익사업 판정 기준",
  },
  {
    id: 3,
    date: "2024.02.10",
    type: "방문 상담",
    category: "회계",
    status: "답변완료",
    title: "재무제표 작성 방법",
  },
];

interface DonationItem {
  id: number;
  donation_type: 'regular' | 'one_time';
  amount: number;
  payment_method: string | null;
  payment_date: Date;
  cms_bank: string | null;
  cms_account_number: string | null;
  cms_account_holder: string | null;
  cms_withdrawal_day: string | null;
  memo: string | null;
}

interface DonationData {
  donations: DonationItem[];
  totalAmount: number;
  year: number;
}

interface UserProfile {
  userId: number;
  churchName: string | null;
  position: string | null;
  denomination: string | null;
  address: string | null;
  postcode: string | null;
  birthDate: Date | null;
  gender: 'M' | 'F' | null;
  profileImage: string | null;
  newsletterSubscribe: boolean;
  marketingAgree: boolean;
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, loading, accessToken } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [donationLoading, setDonationLoading] = useState(true);
  const [expandedDonations, setExpandedDonations] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!loading && user && accessToken) {
        try {
          const response = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.profile);
            setPhone(data.phone);
            setEditForm(data.profile || {});
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else if (!loading) {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, accessToken, loading]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!loading && user && accessToken) {
        try {
          console.log('[MyPage] Fetching donations for user:', user.id);
          const response = await fetch('/api/user/donations', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          console.log('[MyPage] Donations API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('[MyPage] Donations data received:', data);
            setDonationData(data);
          } else {
            const errorData = await response.json();
            console.error('[MyPage] Failed to fetch donations:', response.status, errorData);
          }
        } catch (error) {
          console.error('[MyPage] Error fetching donations:', error);
        } finally {
          setDonationLoading(false);
        }
      } else if (!loading) {
        console.log('[MyPage] User or accessToken not available');
        setDonationLoading(false);
      }
    };

    fetchDonations();
  }, [user, accessToken, loading]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(userProfile || {});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
        setIsEditing(false);
        alert('프로필이 성공적으로 업데이트되었습니다.');
      } else {
        alert('프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const toggleCMSInfo = (donationId: number) => {
    setExpandedDonations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(donationId)) {
        newSet.delete(donationId);
      } else {
        newSet.add(donationId);
      }
      return newSet;
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-mypage.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb items={[{ label: '마이페이지' }]}
            variant="light"
          />
        </PageHeader>

        {/* 모바일 프로필 + 탭 메뉴 */}
        <div className="lg:hidden mt-6">
          {/* 모바일 프로필 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{user?.name || "사용자"}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 모바일 탭 메뉴 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* 데스크톱 사이드바 */}
          <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0 order-first">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              {/* 프로필 영역 */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 text-lg">{user?.name || "사용자"}</h3>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>
              </div>

              {/* 메뉴 */}
              <nav className="p-3">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                          {isActive ? <ChevronRight className="h-4 w-4 ml-auto" /> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* 콘텐츠 영역 */}
          <main className="flex-1 min-w-0 order-last lg:order-none">
            {/* 내 정보 */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">내 정보</h2>
                    <p className="text-sm text-gray-500 mt-0.5">회원 정보를 확인하고 수정할 수 있습니다</p>
                  </div>
                  {!profileLoading && (
                    isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          취소
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <Save className="h-4 w-4" />
                          저장
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        정보 수정
                      </button>
                    )
                  )}
                </div>
                <div className="p-6">
                  {profileLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-500 text-sm">프로필 정보를 불러오는 중...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 기본 정보 섹션 */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">기본 정보</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <User className="h-4 w-4 text-gray-400" />
                              이름
                            </label>
                            <input
                              type="text"
                              value={user?.name || ""}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Mail className="h-4 w-4 text-gray-400" />
                              이메일
                            </label>
                            <input
                              type="email"
                              value={user?.email || ""}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Phone className="h-4 w-4 text-gray-400" />
                              휴대폰 번호
                            </label>
                            <input
                              type="tel"
                              value={phone || ""}
                              placeholder="휴대폰 번호 없음"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* 주소 정보 섹션 */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">주소 정보</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            주소
                          </label>
                          <input
                            type="text"
                            value={isEditing ? editForm.address || "" : userProfile?.address || ""}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="주소를 입력하세요"
                            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${isEditing
                              ? 'bg-white border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            readOnly={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 상담 내역 */}
            {activeTab === "consultations" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">상담 내역</h2>
                  <p className="text-sm text-gray-500 mt-0.5">진행한 상담 내역을 확인할 수 있습니다</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {consultationHistory.map((item) => (
                      <div
                        key={item.id}
                        className="group p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${item.status === "답변완료"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                                }`}>
                                {item.status}
                              </span>
                              <span className="text-xs text-gray-400">{item.category}</span>
                            </div>
                            <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {item.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <Link
                      href="/consultation"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                    >
                      <MessageSquare className="h-4 w-4" />
                      새 상담 신청
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 후원 내역 */}
            {activeTab === "donations" && (
              <div className="space-y-6">
                {/* 후원 요약 카드 */}
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">{donationData?.year || new Date().getFullYear()}년 총 후원금액</p>
                      <p className="text-3xl font-bold">{donationLoading ? '...' : (donationData?.totalAmount || 0).toLocaleString()}원</p>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary font-medium rounded-xl hover:bg-white/90 transition-colors">
                      <FileText className="h-4 w-4" />
                      기부금 영수증 발급
                    </button>
                  </div>
                </div>

                {/* 후원 내역 목록 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">후원 내역</h2>
                    <p className="text-sm text-gray-500 mt-0.5">후원해 주셔서 감사합니다</p>
                  </div>

                  {donationLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-500 text-sm">후원 내역을 불러오는 중...</p>
                    </div>
                  ) : donationData?.donations && donationData.donations.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {donationData.donations.map((item) => {
                        const isRegular = item.donation_type === 'regular';
                        const isCMS = isRegular && item.cms_bank;
                        const paymentDate = new Date(item.payment_date);
                        const formattedDate = `${paymentDate.getFullYear()}.${String(paymentDate.getMonth() + 1).padStart(2, '0')}.${String(paymentDate.getDate()).padStart(2, '0')}`;

                        return (
                          <div
                            key={item.id}
                            className="p-5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isRegular
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                                  }`}>
                                  <Heart className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900">
                                      {isRegular ? '정기후원' : '일시후원'}
                                    </p>
                                    {isCMS && (
                                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                                        CMS
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formattedDate}
                                    </span>
                                    {item.payment_method && (
                                      <span className="flex items-center gap-1">
                                        <CreditCard className="h-3.5 w-3.5" />
                                        {item.payment_method}
                                      </span>
                                    )}
                                  </div>

                                  {/* CMS 계좌정보 표시 */}
                                  {isCMS && (
                                    <div className="mt-3">
                                      <button
                                        onClick={() => toggleCMSInfo(item.id)}
                                        className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className="text-xs font-semibold text-blue-900">CMS 자동이체 정보</p>
                                          {expandedDonations.has(item.id) ? (
                                            <ChevronUp className="h-4 w-4 text-blue-700" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4 text-blue-700" />
                                          )}
                                        </div>
                                      </button>
                                      {expandedDonations.has(item.id) && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                          <div className="space-y-1 text-xs text-blue-800">
                                            <div className="flex gap-2">
                                              <span className="font-medium min-w-[60px]">은행:</span>
                                              <span>{item.cms_bank}</span>
                                            </div>
                                            {item.cms_account_number && (
                                              <div className="flex gap-2">
                                                <span className="font-medium min-w-[60px]">계좌번호:</span>
                                                <span>{item.cms_account_number}</span>
                                              </div>
                                            )}
                                            {item.cms_account_holder && (
                                              <div className="flex gap-2">
                                                <span className="font-medium min-w-[60px]">예금주:</span>
                                                <span>{item.cms_account_holder}</span>
                                              </div>
                                            )}
                                            {item.cms_withdrawal_day && (
                                              <div className="flex gap-2">
                                                <span className="font-medium min-w-[60px]">출금일:</span>
                                                <span>매월 {item.cms_withdrawal_day}일</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* 메모 */}
                                  {item.memo && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      <span className="font-medium">메모:</span> {item.memo}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-lg font-semibold text-gray-900 flex-shrink-0">
                                {Number(item.amount).toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Heart className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">후원 내역이 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 다운로드 내역 */}
            {activeTab === "downloads" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">다운로드 내역</h2>
                  <p className="text-sm text-gray-500 mt-0.5">다운로드한 자료를 다시 받을 수 있습니다</p>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          2024년 종교인 소득세 신고 가이드
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          2024.03.10 다운로드
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <Download className="h-4 w-4" />
                      다시 받기
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          비영리법인 회계기준 실무 가이드
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          2024.02.25 다운로드
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <Download className="h-4 w-4" />
                      다시 받기
                    </button>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 text-center">
                  <Link
                    href="/resources"
                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                  >
                    자료실 바로가기
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* 설정 */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* 알림 설정 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">알림 설정</h2>
                    <p className="text-sm text-gray-500 mt-0.5">알림 수신 방법을 설정합니다</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">이메일 알림</p>
                          <p className="text-sm text-gray-500">상담 답변, 공지사항 등을 이메일로 받습니다</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">SMS 알림</p>
                          <p className="text-sm text-gray-500">중요한 알림을 문자로 받습니다</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">마케팅 정보 수신</p>
                          <p className="text-sm text-gray-500">이벤트, 프로모션 정보를 받습니다</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 계정 관리 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">계정 관리</h2>
                    <p className="text-sm text-gray-500 mt-0.5">계정 보안 및 관리</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">비밀번호 변경</p>
                        <p className="text-sm text-gray-500">계정 보안을 위해 주기적으로 변경하세요</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        변경하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 회원 탈퇴 */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-red-100">
                    <h2 className="text-lg font-semibold text-red-600">회원 탈퇴</h2>
                    <p className="text-sm text-gray-500 mt-0.5">탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다</p>
                  </div>
                  <div className="p-6">
                    <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
