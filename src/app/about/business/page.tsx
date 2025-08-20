import { 
  Briefcase, 
  GraduationCap, 
  FileText, 
  HeadphonesIcon, 
  Calculator,
  Users,
  BookOpen,
  PresentationIcon
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const businesses = [
  {
    category: '세무 상담 서비스',
    icon: HeadphonesIcon,
    items: [
      {
        title: '종교인 소득세 상담',
        description: '목회자 소득세 신고 및 절세 방안 상담'
      },
      {
        title: '교회 법인세 상담',
        description: '종교법인 법인세 신고 및 면세 혜택 안내'
      },
      {
        title: '부가가치세 상담',
        description: '교회 부가가치세 신고 의무 및 환급 상담'
      }
    ]
  },
  {
    category: '교육 프로그램',
    icon: GraduationCap,
    items: [
      {
        title: '세무 실무 교육',
        description: '교회 재정 담당자를 위한 실무 교육 과정'
      },
      {
        title: '온라인 교육',
        description: '시간과 장소에 구애받지 않는 온라인 교육 제공'
      },
      {
        title: '맞춤형 교육',
        description: '교회별 특성에 맞는 맞춤형 교육 프로그램'
      }
    ]
  },
  {
    category: '자료 제공 서비스',
    icon: FileText,
    items: [
      {
        title: '세무 가이드북',
        description: '교회 세무 실무에 필요한 가이드북 제작 및 배포'
      },
      {
        title: '서식 자료',
        description: '각종 세무 신고에 필요한 서식 및 작성 예시 제공'
      },
      {
        title: '법령 정보',
        description: '최신 세법 개정사항 및 유권해석 정보 제공'
      }
    ]
  },
  {
    category: '컨설팅 서비스',
    icon: PresentationIcon,
    items: [
      {
        title: '재정 시스템 구축',
        description: '투명한 교회 재정 시스템 구축 컨설팅'
      },
      {
        title: '내부 통제 시스템',
        description: '교회 재정의 내부 통제 시스템 설계 및 구축'
      },
      {
        title: '정기 점검 서비스',
        description: '교회 재정 상태 정기 점검 및 개선 방안 제시'
      }
    ]
  }
]

export default function BusinessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">주요사업</h1>
        
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            한국교회세무정보봉사단은 교회와 목회자들을 위한 종합적인 세무 지원 서비스를 제공합니다.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {businesses.map((business) => {
            const Icon = business.icon
            return (
              <Card key={business.category} className="overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{business.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {business.items.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
          <div className="text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">특별 지원 프로그램</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">소규모 교회 지원</h3>
                <p>
                  재정이 어려운 소규모 교회를 위한 무료 상담 및 교육 프로그램을 운영합니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">신규 교회 지원</h3>
                <p>
                  새롭게 설립된 교회가 올바른 세무 시스템을 구축할 수 있도록 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">사업 추진 원칙</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              <Calculator className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">정확성</h3>
              <p className="text-gray-600">정확한 정보와 전문적인 서비스 제공</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">접근성</h3>
              <p className="text-gray-600">모든 교회가 쉽게 이용할 수 있는 서비스</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">지속성</h3>
              <p className="text-gray-600">지속적인 교육과 정보 업데이트</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}