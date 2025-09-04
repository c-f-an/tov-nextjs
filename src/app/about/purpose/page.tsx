import { Target, Heart, Shield, Users, BookOpen, Lightbulb } from 'lucide-react'
import { Breadcrumb } from '@/presentation/components/common/Breadcrumb'

export default function PurposePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'About Us', href: '/about' }, { label: '설립목적' }]} />
        <h1 className="text-4xl font-bold mb-8 text-center">설립목적</h1>
        
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8">
          <div className="text-center">
            <Target className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">우리의 비전</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              한국교회의 재정 투명성을 높이고, 건전한 교회 재정 문화를 정착시켜 
              교회가 사회적 신뢰를 회복하고 본연의 사명에 충실할 수 있도록 돕는다.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">설립 배경</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              2018년 종교인 소득세 시행 이후, 많은 교회와 목회자들이 복잡한 세무 행정으로 
              어려움을 겪고 있습니다. 특히 소규모 교회들은 전문 인력과 정보 부족으로 
              더 큰 부담을 안고 있는 실정입니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              이러한 상황에서 한국교회세무정보봉사단(TOV)은 교회와 목회자들에게 
              실질적인 도움을 제공하고, 투명하고 건전한 교회 재정 운영을 지원하기 위해 
              설립되었습니다.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">주요 목적</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">세무 컴플라이언스 지원</h3>
              </div>
              <p className="text-gray-600">
                교회와 목회자들이 세법을 준수하며 안전하게 사역할 수 있도록 
                전문적인 세무 상담과 지원을 제공합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">교육 및 정보 제공</h3>
              </div>
              <p className="text-gray-600">
                세무 관련 교육 프로그램과 최신 정보를 제공하여 교회 재정 담당자들의 
                역량을 강화합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">네트워크 구축</h3>
              </div>
              <p className="text-gray-600">
                교회, 세무 전문가, 관련 기관 간의 협력 네트워크를 구축하여 
                효과적인 지원 체계를 만듭니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">사회적 신뢰 회복</h3>
              </div>
              <p className="text-gray-600">
                투명한 재정 운영을 통해 한국교회가 사회적 신뢰를 회복하고 
                선한 영향력을 발휘할 수 있도록 돕습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">함께 만들어가는 미래</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              TOV는 한국교회와 함께 투명하고 건전한 재정 문화를 만들어가고자 합니다. 
              여러분의 참여와 협력을 통해 더 나은 미래를 만들어갈 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}