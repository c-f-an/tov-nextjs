import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  Users,
  HelpCircle,
  FileText,
} from "lucide-react";
import PageHeader from "@/presentation/components/common/PageHeader";

const consultationTypes = [
  {
    title: "전화 상담",
    description: "신속한 답변이 필요한 경우",
    icon: Phone,
    details: [
      "평일 오전 9시 - 오후 6시",
      "점심시간: 12시 - 1시",
      "02-6951-1391",
    ],
    action: "전화하기",
    link: "tel:02-6951-1391",
  },
  {
    title: "온라인 상담",
    description: "상세한 상담이 필요한 경우1",
    icon: MessageCircle,
    details: ["24시간 접수 가능", "답변 소요: 1-2일", "첨부파일 업로드 가능"],
    action: "상담 신청",
    link: "/consultation/apply",
  },
  {
    title: "방문 상담",
    description: "대면 상담이 필요한 경우",
    icon: Users,
    details: [
      "사전 예약 필수",
      "평일 오전 10시 - 오후 5시",
      "서울 강남구 소재",
    ],
    action: "예약하기",
    link: "#",
  },
  {
    title: "이메일 상담",
    description: "문서 검토가 필요한 경우",
    icon: Mail,
    details: ["tov.npo@gmail.com", "답변 소요: 2-3일", "복잡한 사안 적합"],
    action: "메일 보내기",
    link: "mailto:tov.npo@gmail.com",
  },
];

const popularTopics = [
  "종교인 소득세 신고 방법",
  "비과세 소득 범위",
  "원천징수 의무",
  "법인세 신고",
  "부가가치세 환급",
  "결산 공시 의무",
];

export default function ConsultationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="상담센터"
        description="교회 세무와 관련된 모든 궁금증을 전문가가 해결해 드립니다."
      />

      {/* 상담 유형 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {consultationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link href={type.link}>
              <Card
                key={type.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {type.details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 자주 묻는 질문 */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              자주 묻는 질문
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">
                많은 분들이 궁금해하시는 질문과 답변을 모았습니다.
              </p>
              <div className="space-y-2">
                {popularTopics.map((topic, index) => (
                  <Link
                    key={index}
                    href="/consultation/faq"
                    className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium">{topic}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/consultation/faq"
                className="inline-block mt-4 text-primary hover:text-primary/80 font-medium"
              >
                전체 FAQ 보기 →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              상담 준비사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              효율적인 상담을 위해 다음 사항을 준비해 주세요.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold mb-1">기본 정보</h4>
                <p className="text-sm text-gray-700">
                  교회명, 설립연도, 법인 유형, 규모
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-semibold mb-1">재정 현황</h4>
                <p className="text-sm text-gray-700">
                  연간 예산, 수입 구조, 주요 지출 항목
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-semibold mb-1">상담 내용</h4>
                <p className="text-sm text-gray-700">
                  구체적인 질문 사항, 관련 서류
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상담 예약 현황 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            이번 주 상담 가능 시간
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {["월", "화", "수", "목", "금"].map((day, index) => (
              <div key={index} className="text-center">
                <div className="font-semibold mb-2">{day}요일</div>
                <div className="space-y-1">
                  <div className="text-sm p-2 bg-green-100 rounded">
                    오전 가능
                  </div>
                  <div className="text-sm p-2 bg-yellow-100 rounded">
                    오후 일부
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            * 실시간 예약 현황은 전화 문의 바랍니다.
          </p>
        </CardContent>
      </Card>

      {/* 상담사 소개 */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          전문 상담사 소개
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold mb-1">최호윤 회계사</h3>
            <p className="text-sm text-gray-600">
              사단법인 토브협회 이사장
              <br /> 회계법인 더함 대표
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold mb-1">김석희 회계사</h3>
            <p className="text-sm text-gray-600">회계법인 더함 회계사</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold mb-1">장성일 세무사</h3>
            {/* <p className="text-sm text-gray-600">법인세/부가세 전문</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
