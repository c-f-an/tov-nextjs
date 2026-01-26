"use client";

import { MapPin, Phone, Mail, Clock, Train, Bus, Car } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import dynamic from "next/dynamic";
import PageHeader from "@/presentation/components/common/PageHeader";

const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 animate-pulse" />
        <p className="text-lg">지도를 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-about-location.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "About Us", href: "/about" }, { label: "오시는 길" }]}
            variant="light"
          />
        </PageHeader>

        {/* 지도 영역 */}
        <div className="mb-8">
          <div
            className="bg-gray-200 rounded-lg overflow-hidden"
            style={{ height: "400px" }}
          >
            <KakaoMap
              address={
                process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
                "서울 종로구 삼일대로 428 낙원상가 5층 500호"
              }
              markerTitle="사단법인 토브협회"
              level={3}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 주소 및 연락처 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>주소 및 연락처</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">주소</p>
                  <p className="text-gray-600">
                    {process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
                      "서울 종로구 삼일대로 428 낙원상가 5층 500호"}
                    <br />
                    (우) 03140
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">전화</p>
                  <p className="text-gray-600">
                    02-6951-1391(FAX: 0505-231-2481)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">이메일</p>
                  <p className="text-gray-600">tov.npo@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">운영시간</p>
                  <p className="text-gray-600">
                    평일: 오전 9시 - 오후 6시
                    <br />
                    점심시간: 오후 12시 - 1시
                    <br />
                    토요일, 일요일, 공휴일 휴무
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 교통편 안내 */}
          <Card>
            <CardHeader>
              <CardTitle>교통편 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Train className="h-5 w-5 text-primary mt-1" />
                <div className="w-full">
                  <p className="font-semibold mb-2">지하철</p>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">
                        • 1호선 종로3가역
                      </p>
                      <p className="ml-4 text-sm">
                        1번 출구 → 탑골공원 방면 300m → 사동 방면 200m
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        • 5호선 종로3가역
                      </p>
                      <p className="ml-4 text-sm">
                        5번 출구 → 신한은행 ATM 낙원지점 방향 80m
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bus className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">버스</p>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">• 간선버스</p>
                      <p className="ml-4 text-sm">
                        100, 103, 143, 150, 160, 161, 201, 260, 262, 270, 271,
                        273, 370, 601, 720, 721
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">• 지선버스</p>
                      <p className="ml-4 text-sm">7212</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">• 광역버스</p>
                      <p className="ml-4 text-sm">1000, 9205, 9301</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">• 공항버스</p>
                      <p className="ml-4 text-sm">6002</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 안내사항 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">방문 안내사항</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 방문 전 전화 예약을 하시면 더욱 원활한 상담이 가능합니다.</li>
            <li>• 주차가 어려우니 대중교통 이용을 권장합니다.</li>
            <li>• 휠체어 이용자를 위한 엘리베이터가 설치되어 있습니다.</li>
            <li>• 코로나19 예방을 위해 마스크 착용을 부탁드립니다.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
