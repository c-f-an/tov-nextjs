import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Heart, Users, Target, TrendingUp, CreditCard, Building, FileText, Gift } from 'lucide-react'

const donationTypes = [
  {
    title: '정기후원',
    description: '매월 일정 금액을 후원합니다',
    icon: Heart,
    benefits: [
      '안정적인 사업 운영 지원',
      '정기 소식지 발송',
      '연말정산 자동 처리'
    ],
    amounts: ['1만원', '3만원', '5만원', '직접입력']
  },
  {
    title: '일시후원',
    description: '원하실 때 자유롭게 후원합니다',
    icon: Gift,
    benefits: [
      '자유로운 후원 참여',
      '기부금 영수증 발급',
      '후원 내역 확인'
    ],
    amounts: ['5만원', '10만원', '30만원', '직접입력']
  }
]

const impactStats = [
  {
    number: '500+',
    label: '교육 프로그램 수혜 교회',
    icon: Users
  },
  {
    number: '1,200+',
    label: '무료 상담 제공 건수',
    icon: Target
  },
  {
    number: '50+',
    label: '발간 자료 및 가이드북',
    icon: FileText
  },
  {
    number: '95%',
    label: '상담 만족도',
    icon: TrendingUp
  }
]

const donationMethods = [
  {
    method: '계좌이체',
    icon: Building,
    details: [
      '국민은행 123-456-789012',
      '예금주: (사)한국교회세무정보봉사단'
    ]
  },
  {
    method: '신용카드',
    icon: CreditCard,
    details: [
      '온라인 결제 가능',
      '정기/일시 후원 모두 가능'
    ]
  }
]

export default function DonationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">후원하기</h1>
        <p className="text-lg text-gray-600">
          여러분의 후원이 투명하고 건강한 한국교회를 만들어갑니다.
        </p>
      </div>

      {/* 후원의 영향력 */}
      <div className="mb-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">후원의 영향력</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-gray-700">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 후원 방법 선택 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {donationTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card key={type.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-semibold mb-2">후원 혜택</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="font-semibold mb-2">후원 금액</p>
                  <div className="grid grid-cols-2 gap-2">
                    {type.amounts.map((amount) => (
                      <button
                        key={amount}
                        className="px-3 py-2 text-sm border rounded hover:bg-gray-50 transition-colors"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  {type.title} 신청하기
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 후원금 사용 내역 */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>후원금 사용 계획</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">교육 프로그램 운영</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">무료 상담 서비스</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">자료 개발 및 연구</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">운영비</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/donation/report"
              className="text-primary hover:text-primary/80 font-medium"
            >
              상세 재정보고 보기 →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 후원 방법 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {donationMethods.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.method}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {item.method}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.details.map((detail, index) => (
                    <li key={index} className="text-gray-700">{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 기부금 영수증 안내 */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h3 className="text-lg font-bold mb-4">기부금 영수증 안내</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">발급 대상</h4>
            <p className="text-sm text-gray-700">
              한국교회세무정보봉사단은 기획재정부 지정 공익법인으로, 
              후원금에 대해 세액공제 혜택을 받으실 수 있는 기부금 영수증을 발급해 드립니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">세액공제 혜택</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 1천만원 이하: 15% 세액공제</li>
              <li>• 1천만원 초과: 30% 세액공제</li>
              <li>• 국세청 연말정산 간소화 서비스 등록</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}