import { Heart, Link, Target, Lightbulb, Shield } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function GreetingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <Breadcrumb
          items={[{ label: "About Us", href: "/about" }, { label: "우리는" }]}
        />

        <PageHeader 
          title="사단법인 Tov협회"
          description="Mission과 Fund가 만나는 곳"
        />

        {/* 토브 소개 섹션 */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <span className="text-3xl font-bold text-primary">טוב</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                &apos;토브(Tov)&apos;의 의미
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                우리말로 <span className="font-semibold text-primary">&apos;좋음&apos;, &apos;선함&apos;, &apos;유익함&apos;</span>의 의미를 가진 히브리어입니다.
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                &apos;토브&apos;는 단순히 좋다는 감정적 표현을 넘어서<br/>
                도덕적이고 실제적인 &apos;선(善)&apos;의 가치를 담은 단어입니다.
              </p>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-xl font-bold text-primary">
                  세상을 더 정의롭게 만드는 힘,<br/>
                  그 &apos;좋음&apos;을 우리는 &apos;Tov&apos;라 부릅니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 협회 소개 섹션 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            (사) Tov협회는…
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    모두를 위한 선함
                  </h3>
                  <p className="text-sm font-medium text-blue-600 mb-3">
                    Ethical Goodness
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Tov는 투명성과 책임을 핵심 가치로 삼습니다.
                    우리는 Fund가 공정하고 정직하게 운영될 때, 진짜 선함이 만들어진다고 믿습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    모두를 위한 결과
                  </h3>
                  <p className="text-sm font-medium text-green-600 mb-3">
                    Impactful Goodness
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Tov는 단순히 &apos;좋은 뜻&apos;을 넘어서, 모두에게 유익한 결과를
                    만들어내는 걸 목표로 합니다. Mission과 Fund를 연결해, 비영리
                    단체가 구체적인 변화를 만들도록 돕습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-purple-100">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    모두를 위한 의미
                  </h3>
                  <p className="text-sm font-medium text-purple-600 mb-3">
                    Purposeful Goodness
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Fund를 의미 없이 사용해서는 안 됩니다.
                    Tov는 Fund가 제 자리를 찾고, 제 역할을 하도록 안내합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 비전과 미션 섹션 */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Vision</h2>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-3">
                &ldquo;Tov는 Mission과 Fund가 만나 비영리의 가치를 키워가는 세상,<br/>
                그 연결의 중심에 있습니다.&rdquo;
              </p>
              <p className="text-gray-600 italic mb-4">
                Tov exists at the center where funds meet mission—to amplify the
                value and impact of the nonprofit world.
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="text-primary font-semibold">*</span> 토브는 사명(Mission)의 방향성과 기금(Fund)의 힘이 제대로 만날 수
                  있도록 설계하고 연결하는, 전략적 중심축입니다.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Mission</h2>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-4">
                &ldquo;토브는 비영리단체가 재정의 투명성을 높이고, 자금 운영 역량을
                키우며, 혁신적인 솔루션을 통해 지속 가능한 변화를 만들어<br/>
                고유한 사명을 이루도록 지원합니다.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 실행 전략 섹션 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">실행 전략</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-primary">
              <div className="flex items-start">
                <div className="text-3xl font-bold text-primary/20 mr-4">
                  01
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">재정적 투명성 강화</h3>
                  <p className="text-gray-700">
                    신뢰는 투명성에서 시작됩니다. 우리는 Fund의 흐름이 명확하게
                    공개되고, 관리되도록 돕습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-primary">
              <div className="flex items-start">
                <div className="text-3xl font-bold text-primary/20 mr-4">
                  02
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">
                    자금 운영 교육과 역량 강화
                  </h3>
                  <p className="text-gray-700">
                    비영리 단체가 스스로 기금을 책임 있게 계획하고 운영할 수
                    있도록, 실무 중심의 교육과 컨설팅을 제공합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-primary">
              <div className="flex items-start">
                <div className="text-3xl font-bold text-primary/20 mr-4">
                  03
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">혁신적 솔루션 제공</h3>
                  <p className="text-gray-700">
                    토브는 기술과 전략을 결합해 지속 가능한 자금 운용 모델과
                    맞춤형 도구를 제안하며, 복잡하고 빠르게 변하는 환경
                    속에서도, 단체가 본질에 집중할 수 있도록 뒷받침합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values 섹션 */}
        <div className="bg-gray-50 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Link className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">연결</h3>
              <p className="text-sm text-gray-500 mb-2">Connection</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                재정적 자원, 비영리 단체, 그리고 사회적 가치 사이의 강력한 연결
                고리를 구축합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">투명성</h3>
              <p className="text-sm text-gray-500 mb-2">Transparency</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                모든 재정적 운영과 정보 공개에 있어 최고 수준의 투명성을
                유지하여 신뢰의 기반을 마련합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">효율성</h3>
              <p className="text-sm text-gray-500 mb-2">Efficiency</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                비영리 단체들이 후원금을 가장 효율적으로 사용하여 최대의 사회적
                영향력을 창출할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">성장</h3>
              <p className="text-sm text-gray-500 mb-2">Growth</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                비영리 단체들이 재정적으로 안정하고 조직적으로 성장할 수 있도록
                장기적인 파트너십을 지향합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">신뢰</h3>
              <p className="text-sm text-gray-500 mb-2">Trust</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                이해관계자 모두가 상호 신뢰를 바탕으로 협력하는 문화를 조성하고
                유지합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}