import { Users, User, Building, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function OrganizationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <PageHeader
          title={
            <div className="inline-flex flex-col items-center text-white">
              {/* 빈 공간 확보: case1의 첫 줄과 똑같은 폰트 사이즈와 여백을 주되 invisible 처리 */}
              <span className="text-lg md:text-xl font-bold mb-1 invisible select-none">
                &nbsp;
              </span>

              {/* 실제 텍스트: 이제 case1의 두 번째 줄과 정확히 같은 높이에 위치합니다 */}
              <div className="flex items-center gap-2">
                <span className="text-5xl md:text-6xl font-black tracking-tighter">TOV</span>
                <span className="text-2xl md:text-3xl font-bold">와 함께하는 이들</span>
              </div>
            </div>
          }
          description="더 나은 세상을 열어가는 이야기의 주인공, 바로 당신입니다."
          backgroundImage="/menu-header/header_bg_together.webp"
          overlayColor="#00357f"
          overlayOpacity={60}
        >
          <Breadcrumb
            items={[{ label: "About Us", href: "/about" }, { label: "조직도" }]}
            variant="light"
          />
        </PageHeader>

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
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
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
          </div>
        </div>

        {/* 자문위원회 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8">
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
    </main>
  );
}
