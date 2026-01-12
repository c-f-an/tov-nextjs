"use client";

import Link from "next/link";
import { Users, BookOpen, HandshakeIcon, DollarSign } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "건강한 재정관리",
    description:
      "교회와 비영리단체의 투명하고 체계적인 재정관리를 위한 컨설팅과 교육을 제공합니다.",
    icon: DollarSign,
    link: "/movement/financial-management",
    bgColor: "bg-[#EBF2F9]",
    iconColor: "text-[#004785]",
    hoverBg: "hover:bg-blue-100",
  },
  {
    id: 2,
    title: "건강한 재정교육",
    description:
      "재정 투명성의 중요성과 실천 방법을 교육하여 건강한 재정 문화 확산에 기여합니다.",
    icon: BookOpen,
    link: "/movement/financial-education",
    bgColor: "bg-[#EAF8F8]",
    iconColor: "text-[#2BB8B8]",
    hoverBg: "hover:bg-green-100",
  },
  {
    id: 3,
    title: "결산서 공개 운동",
    description:
      "자발적 결산서 공개를 통해 교회와 비영리단체의 재정 투명성을 향상시킵니다.",
    icon: Users,
    link: "/movement/financial-disclosure",
    bgColor: "bg-[#EFF2FE]",
    iconColor: "text-[#5E72E4]",
    hoverBg: "hover:bg-purple-100",
  },
  {
    id: 4,
    title: "연대협력",
    description:
      "투명한 재정 문화 확산을 위해 다양한 기관과 협력하여 시너지를 창출합니다.",
    icon: HandshakeIcon,
    link: "/movement/cooperation",
    bgColor: "bg-[#EAF9F2]",
    iconColor: "text-[#2DCE89]",
    hoverBg: "hover:bg-orange-100",
  },
];

export function TovActivities() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">토브 활동</h2>
        <Link
          href="/movement"
          className="text-sm text-blue-600 hover:underline"
        >
          전체보기 →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <Link key={activity.id} href={activity.link} className="group">
              <div
                className={`${activity.bgColor} rounded-lg p-6 h-full ${activity.hoverBg} transition-colors`}
              >
                <div className={`mb-4 ${activity.iconColor}`}>
                  <Icon className="w-10 h-10" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {activity.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 추가 정보 섹션 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              투명하고 건강한 재정문화를 만들어갑니다
            </h3>
            <p className="text-gray-600">
              토브협회는 교회와 비영리단체의 재정 투명성 향상을 위해 다양한
              활동을 펼치고 있습니다.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/consultation/apply"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 hover:text-accent-foreground transition-colors text-sm font-medium"
            >
              상담 신청
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg border text-ghost-foreground rounded-lg hover:bg-accent transition-colors text-sm font-medium"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
