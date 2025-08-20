import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building2, Target, Briefcase, Users, MapPin, FileText } from 'lucide-react'

const aboutItems = [
  {
    title: '인사말',
    description: '한국교회세무정보봉사단의 인사말입니다.',
    href: '/about/greeting',
    icon: FileText,
  },
  {
    title: '설립목적',
    description: '투명하고 건강한 교회 재정을 위한 우리의 목적',
    href: '/about/purpose',
    icon: Target,
  },
  {
    title: '주요사업',
    description: '교회와 목회자를 위한 다양한 세무 서비스',
    href: '/about/business',
    icon: Briefcase,
  },
  {
    title: '조직도',
    description: '전문가들로 구성된 조직 구조',
    href: '/about/organization',
    icon: Users,
  },
  {
    title: '오시는길',
    description: '한국교회세무정보봉사단 찾아오시는 길',
    href: '/about/location',
    icon: MapPin,
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">협회소개</h1>
        <p className="text-lg text-gray-600">
          한국교회세무정보봉사단(TOV)은 교회의 투명하고 건강한 재정 운영을 돕는 전문 단체입니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {aboutItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">한국교회세무정보봉사단 (TOV)</h2>
          <p className="text-gray-600 leading-relaxed">
            TOV는 교회와 목회자들이 세무 관련 업무를 투명하고 정확하게 처리할 수 있도록 
            전문적인 도움을 제공합니다. 우리는 교회가 본연의 사명에 집중할 수 있도록 
            재정 관리의 부담을 덜어드리고자 합니다.
          </p>
        </div>
      </div>
    </div>
  )
}