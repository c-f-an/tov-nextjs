import Image from 'next/image'
import { Quote } from 'lucide-react'
import { Breadcrumb } from '@/presentation/components/common/Breadcrumb'

export default function GreetingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <Breadcrumb items={[{ label: 'About Us', href: '/about' }, { label: '인사말' }]} />
        <h1 className="text-4xl font-bold mb-8 text-center">인사말</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3">
              <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <p>대표 사진</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg">대표이사</h3>
                <p className="text-gray-600">한국교회세무정보봉사단</p>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <Quote className="h-8 w-8 text-primary mb-4" />
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  안녕하십니까? 한국교회세무정보봉사단(TOV) 홈페이지를 방문해 주신 여러분을 
                  진심으로 환영합니다.
                </p>
                <p>
                  한국교회세무정보봉사단은 교회와 목회자들이 복잡한 세무 문제로 인해 
                  사역에 어려움을 겪지 않도록 돕기 위해 설립되었습니다. 우리는 전문적인 
                  세무 지식과 경험을 바탕으로 교회가 투명하고 건전한 재정 운영을 할 수 
                  있도록 지원하고 있습니다.
                </p>
                <p>
                  특별히 종교인 소득세 시행 이후 많은 교회와 목회자들이 세무 관련 
                  어려움을 겪고 있는 현실에서, TOV는 맞춤형 상담과 교육을 통해 
                  실질적인 도움을 제공하고자 합니다.
                </p>
                <p>
                  우리의 목표는 단순히 세무 문제를 해결하는 것을 넘어, 한국교회가 
                  사회적 신뢰를 회복하고 건강한 공동체로 성장할 수 있도록 돕는 것입니다. 
                  이를 위해 최선을 다하겠습니다.
                </p>
                <p>
                  여러분의 관심과 참여를 부탁드리며, TOV가 한국교회를 섬기는 일에 
                  귀하게 쓰임받기를 소망합니다.
                </p>
                <p className="font-semibold">
                  감사합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">TOV의 약속</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-bold text-lg mb-2">전문성</div>
              <p className="text-gray-600">
                세무 전문가들이 정확하고 신뢰할 수 있는 정보를 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-2">투명성</div>
              <p className="text-gray-600">
                모든 과정을 투명하게 공개하고 함께 만들어갑니다.
              </p>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-2">섬김</div>
              <p className="text-gray-600">
                한국교회를 섬기는 마음으로 최선을 다하겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}