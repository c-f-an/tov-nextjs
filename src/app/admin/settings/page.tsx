"use client";

import { useState } from "react";
import { Save, Globe, Mail, Shield, Bell } from "lucide-react";
import { AdminLayout } from "@/presentation/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "사단법인 토브협회",
    siteDescription: "교회의 투명하고 건강한 재정 운영을 돕는 전문 단체",
    contactEmail: "tov.npo@gmail.com",
    contactPhone: "02-6951-1391",
    address: "서울특별시 종로구 삼일대로 428, 500-42호",

    emailNotifications: true,
    smsNotifications: true,
    maintenanceMode: false,

    registrationEnabled: true,
    emailVerification: true,
    socialLogin: false,

    googleAnalytics: "",
    naverWebmaster: "",
    metaKeywords: "교회세무, 종교인소득, 비영리재정, TOV",
  });

  const handleSave = () => {
    alert("설정이 저장되었습니다.");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">사이트 설정</h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            설정 저장
          </button>
        </div>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              기본 정보
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  사이트명
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  사이트 설명
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  대표 이메일
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  대표 전화
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, contactPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">주소</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>이메일 알림 활성화</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smsNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>SMS 알림 활성화</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-red-600">
                  유지보수 모드 (사이트 접근 제한)
                </span>
              </label>
            </div>
          </div>

          {/* 회원 설정 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              회원 설정
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registrationEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>회원가입 허용</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.emailVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailVerification: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>이메일 인증 필수</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.socialLogin}
                  onChange={(e) =>
                    setSettings({ ...settings, socialLogin: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>소셜 로그인 허용</span>
              </label>
            </div>
          </div>

          {/* SEO 설정 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              SEO 설정
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.googleAnalytics}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleAnalytics: e.target.value,
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  네이버 웹마스터 인증
                </label>
                <input
                  type="text"
                  value={settings.naverWebmaster}
                  onChange={(e) =>
                    setSettings({ ...settings, naverWebmaster: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  메타 키워드
                </label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) =>
                    setSettings({ ...settings, metaKeywords: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
