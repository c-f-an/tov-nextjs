'use client'

import { MapPin, Phone, Mail, Clock, Train, Bus, Car } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from '@/presentation/components/common/Breadcrumb'

export default function LocationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[{ label: 'About Us', href: '/about' }, { label: '오시는길' }]} />
        <h1 className="text-4xl font-bold mb-8 text-center">오시는길</h1>
        
        {/* 지도 영역 */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">지도 API 연동 예정</p>
              </div>
            </div>
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
                    서울특별시 서초구 서초대로 396<br />
                    강남빌딩 15층 1501호<br />
                    (우) 06668
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">전화</p>
                  <p className="text-gray-600">02-1234-5678</p>
                  <p className="text-gray-600">팩스: 02-1234-5679</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">이메일</p>
                  <p className="text-gray-600">info@tov.or.kr</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">운영시간</p>
                  <p className="text-gray-600">
                    평일: 오전 9시 - 오후 6시<br />
                    점심시간: 오후 12시 - 1시<br />
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
                <div>
                  <p className="font-semibold">지하철</p>
                  <p className="text-gray-600">
                    2호선 강남역 5번 출구 도보 5분<br />
                    신분당선 강남역 5번 출구 도보 5분
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Bus className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">버스</p>
                  <p className="text-gray-600">
                    간선버스: 140, 144, 145, 471<br />
                    지선버스: 4211, 4421, 4318<br />
                    광역버스: 9404, 9408, 9409
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">자가용</p>
                  <p className="text-gray-600">
                    건물 지하 주차장 이용 가능<br />
                    방문객 2시간 무료 주차<br />
                    (주차권은 사무실에서 발급)
                  </p>
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
            <li>• 주차장이 혼잡할 수 있으니 대중교통 이용을 권장합니다.</li>
            <li>• 휠체어 이용자를 위한 엘리베이터가 설치되어 있습니다.</li>
            <li>• 코로나19 예방을 위해 마스크 착용을 부탁드립니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}