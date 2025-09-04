import { Users, User, Building, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from '@/presentation/components/common/Breadcrumb'

export default function OrganizationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <Breadcrumb items={[{ label: 'About Us', href: '/about' }, { label: '조직도' }]} />
        <h1 className="text-4xl font-bold mb-8 text-center">조직도</h1>
        
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600">
            전문성과 사명감을 갖춘 인재들이 한국교회를 섬기고 있습니다.
          </p>
        </div>

        {/* 이사장 */}
        <div className="mb-8">
          <Card className="mx-auto">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-center">이사장</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3">
                  <User className="w-full h-full p-6 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg">이사장</h3>
                <p className="text-gray-600">전체 운영 총괄</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 이사회 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">이사회</h2>
          <div className="grid md:grid-cols-3 gap-4 mx-auto">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Card key={num}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2">
                      <User className="w-full h-full p-4 text-gray-400" />
                    </div>
                    <h4 className="font-semibold">이사 {num}</h4>
                    <p className="text-sm text-gray-600">이사회 구성원</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 운영 조직 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">운영 조직</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  사무국
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li>• 사무국장</li>
                  <li>• 행정 담당</li>
                  <li>• 회계 담당</li>
                  <li>• 홍보 담당</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  교육사업부
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li>• 교육부장</li>
                  <li>• 교육 기획팀</li>
                  <li>• 강사 운영팀</li>
                  <li>• 교재 개발팀</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  상담사업부
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li>• 상담부장</li>
                  <li>• 세무 상담팀</li>
                  <li>• 회계 상담팀</li>
                  <li>• 법무 상담팀</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  연구개발부
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li>• 연구부장</li>
                  <li>• 정책 연구팀</li>
                  <li>• 자료 개발팀</li>
                  <li>• IT 개발팀</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 자문위원회 */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">자문위원회</h2>
          <div className="grid md:grid-cols-3 gap-6 mx-auto">
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">세무 자문위원</h3>
              <p className="text-gray-600">세무사, 회계사 등 세무 전문가</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">법률 자문위원</h3>
              <p className="text-gray-600">변호사, 법무사 등 법률 전문가</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">목회 자문위원</h3>
              <p className="text-gray-600">목사, 장로 등 교회 지도자</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            * 조직도는 운영 상황에 따라 변경될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}