"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { User, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

interface OrganizationPerson {
  id: number;
  name: string;
  category: string;
  description: string | null;
  photoUrl: string | null;
  position: string | null;
  email: string | null;
  phone: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function OrganizationPage() {
  const [people, setPeople] = useState<Record<string, OrganizationPerson[]>>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/organization-people');
        const data = await response.json();
        setPeople(data.grouped || {});
        setCategoryOrder(data.categoryOrder || []);
      } catch (error) {
        console.error('Failed to fetch organization people:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // 이사회를 제외한 다른 카테고리들 (API에서 받은 순서 유지)
  const otherCategories = useMemo(() => {
    return categoryOrder.filter(category => category !== '이사회');
  }, [categoryOrder]);

  // 첫 번째 탭을 기본 선택
  useEffect(() => {
    if (otherCategories.length > 0 && !activeTab) {
      setActiveTab(otherCategories[0]);
    }
  }, [otherCategories, activeTab]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-about-organization.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "About Us", href: "/about" }, { label: "조직도" }]}
            variant="light"
          />
        </PageHeader>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">로딩 중...</p>
          </div>
        ) : (
          <>
            {/* 이사회 */}
            {people['이사회'] && people['이사회'].length > 0 && (
              <div className="mb-8">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="text-center">섬기는 사람들</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mx-auto">
                  {people['이사회'].map((person) => (
                    <Card key={person.id}>
                      <CardContent className="pt-6 pb-6">
                        <div className="text-center">
                          <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                            {person.photoUrl ? (
                              <Image
                                src={person.photoUrl}
                                alt={person.name}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-full h-full p-5 text-gray-400" />
                            )}
                          </div>
                          <h4 className="font-semibold text-base">{person.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{person.position || person.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 다른 카테고리들 - 탭 형태 */}
            {otherCategories.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-10">
                {/* 탭 네비게이션 */}
                <ul className="flex flex-wrap justify-center gap-2 md:gap-5 mb-8 pb-4 border-b border-gray-200">
                  {otherCategories.map((category) => (
                    <li
                      key={category}
                      onClick={() => setActiveTab(category)}
                      className={`
                        px-3 py-2 cursor-pointer text-sm md:text-base transition-all
                        ${activeTab === category
                          ? 'text-primary font-bold border-b-3 border-primary'
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                      style={{
                        borderBottomWidth: activeTab === category ? '3px' : '0',
                        marginBottom: activeTab === category ? '-17px' : '0',
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>

                {/* 멤버 리스트 */}
                {activeTab && people[activeTab] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {people[activeTab].map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center text-base text-gray-700"
                      >
                        <ChevronRight className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="font-bold mr-2">{person.name}</span>
                        <span className="text-gray-500">{person.position}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 데이터가 없는 경우 */}
            {Object.keys(people).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                등록된 정보가 없습니다.
              </div>
            )}
          </>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            * 조직도는 운영 상황에 따라 변경될 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
