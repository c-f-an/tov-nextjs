import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Building2,
  Target,
  Briefcase,
  Users,
  MapPin,
  FileText,
} from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

const aboutItems = [
  {
    title: "우리는",
    description: "Tov를 소개합니다.",
    href: "/about/greeting",
    icon: FileText,
  },
  {
    title: "주요사업",
    description: "교회와 목회자를 위한 다양한 세무 서비스",
    href: "/about/business",
    icon: Briefcase,
  },
  {
    title: "조직도",
    description: "전문가들로 구성된 조직 구조",
    href: "/about/organization",
    icon: Users,
  },
  {
    title: "오시는길",
    description: "한국교회세무정보봉사단 찾아오시는 길",
    href: "/about/location",
    icon: MapPin,
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "About Us" }]} />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <div className="mb-12 text-center bg-gray-50 p-6 rounded-lg">
          <p className="text-xl text-gray-600 my-2">
            “당신의 ’Mission’과 ‘Fund’를 연결하는&nbsp;
            <span className="text-primary font-bold text-3xl">Tov</span>&nbsp;
            입니다.”
          </p>
          <p className="text-lg text-gray-600 my-2">
            Tov exists to connect funds with mission.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto">
        {aboutItems.map((item) => {
          const Icon = item.icon;
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
          );
        })}
      </div>
    </div>
  );
}
