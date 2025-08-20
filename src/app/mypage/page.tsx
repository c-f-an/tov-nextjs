'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, FileText, Heart, MessageCircle, Settings, LogOut, Download, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const menuItems = [
  { icon: User, label: '내 정보', href: '#profile' },
  { icon: FileText, label: '상담 내역', href: '#consultations' },
  { icon: Heart, label: '후원 내역', href: '#donations' },
  { icon: Download, label: '다운로드 내역', href: '#downloads' },
  { icon: Settings, label: '설정', href: '#settings' }
]

const consultationHistory = [
  {
    id: 1,
    date: '2024.03.15',
    type: '온라인 상담',
    category: '종교인 소득세',
    status: '답변완료',
    title: '비과세 소득 범위 문의'
  },
  {
    id: 2,
    date: '2024.02.28',
    type: '전화 상담',
    category: '법인세',
    status: '답변완료',
    title: '수익사업 판정 기준'
  },
  {
    id: 3,
    date: '2024.02.10',
    type: '방문 상담',
    category: '회계',
    status: '답변완료',
    title: '재무제표 작성 방법'
  }
]

const donationHistory = [
  {
    date: '2024.03.01',
    type: '정기후원',
    amount: '30,000',
    method: '신용카드'
  },
  {
    date: '2024.02.01',
    type: '정기후원',
    amount: '30,000',
    method: '신용카드'
  },
  {
    date: '2024.01.15',
    type: '일시후원',
    amount: '100,000',
    method: '계좌이체'
  }
]

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">마이페이지</h1>
        <p className="text-lg text-gray-600">회원님의 활동 내역을 확인하실 수 있습니다.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 사이드바 메뉴 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold">홍길동</h3>
                <p className="text-sm text-gray-600">hong@email.com</p>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.href.slice(1)
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.href.slice(1))}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span>로그아웃</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>내 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">이름</label>
                      <input
                        type="text"
                        value="홍길동"
                        className="w-full px-3 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">이메일</label>
                      <input
                        type="email"
                        value="hong@email.com"
                        className="w-full px-3 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">휴대폰</label>
                      <input
                        type="tel"
                        value="010-1234-5678"
                        className="w-full px-3 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">교회명</label>
                      <input
                        type="text"
                        value="샘플교회"
                        className="w-full px-3 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">주소</label>
                    <input
                      type="text"
                      value="서울특별시 강남구 테헤란로 123"
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                      readOnly
                    />
                    <input
                      type="text"
                      value="건물명 101호"
                      className="w-full px-3 py-2 border rounded-lg"
                      readOnly
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                      정보 수정
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'consultations' && (
            <Card>
              <CardHeader>
                <CardTitle>상담 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.type} • {item.category}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.status === '답변완료' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{item.date}</span>
                        <button className="text-sm text-primary hover:text-primary/80">
                          상세보기 →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/consultation"
                    className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    새 상담 신청
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'donations' && (
            <Card>
              <CardHeader>
                <CardTitle>후원 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">2024년 총 후원금액</p>
                      <p className="text-2xl font-bold">190,000원</p>
                    </div>
                    <button className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
                      기부금 영수증 발급
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {donationHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-gray-600">{item.date} • {item.method}</p>
                      </div>
                      <span className="font-semibold">{item.amount}원</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/donation"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    후원 관리 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'downloads' && (
            <Card>
              <CardHeader>
                <CardTitle>다운로드 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">2024년 종교인 소득세 신고 가이드</p>
                        <p className="text-sm text-gray-600">2024.03.10 다운로드</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      다시 받기
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">비영리법인 회계기준 실무 가이드</p>
                        <p className="text-sm text-gray-600">2024.02.25 다운로드</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      다시 받기
                    </button>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/resources"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    자료실 바로가기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">알림 설정</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span>이메일 알림 받기</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span>SMS 알림 받기</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>마케팅 정보 수신 동의</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">비밀번호 변경</h3>
                    <button className="px-4 py-2 border rounded hover:bg-gray-50">
                      비밀번호 변경하기
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">회원 탈퇴</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                    <button className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}