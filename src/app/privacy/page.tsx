import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "개인정보처리방침" }]} />
      <div className="mx-auto">
        <PageHeader
          title="개인정보처리방침"
          description="토브협회는 개인정보보호법에 따라 정보주체의 개인정보를 보호합니다."
        />

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. 총칙</h2>
            <p className="mb-4">
              ① 개인정보란 생존하는 개인에 관한 정보로서 당해 정보에 포함되어
              있는 성명, 주민등록번호 등의 사항에 의하여 당해 개인을 식별할 수
              있는 정보(당해 정보만으로는 특정 개인을 식별할 수 없더라도 다른
              정보와 용이하게 결합하여 식별할 수 있는 것을 포함합니다)를
              말합니다.
            </p>
            <p className="mb-4">
              ② 사단법인 토브협회는 귀하의 개인정보보호를 매우 중요시하며, 회원
              및 서비스이용자(이하 '이용자')의 개인정보의 보호를 위해 정보수집의
              목적과 이용 및 정책적 보안을 규정한 것으로 『정보통신망 이용촉진
              및 정보보호 등에 관한 법률』상의 개인정보보호규정과
              『개인정보보호법』에 의거하여 작성되었습니다. 사단법인 토브협회는
              개인정보를 수집하고 처리함에 있어서 관련 법령 및 지침 변경 시 즉각
              반영할 수 있도록 노력하며, 개인정보 취급자를 최소화 하고,
              내부관리계획에 따라 주기적으로 개인정보 취급방침의 이행 및 관련
              법령의 준수 여부를 확인하는 등 소중한 회원님의 개인정보보호에
              최선을 다하고 있습니다.
            </p>
            <p className="mb-4">
              ③ 사단법인 토브협회는 개인정보보호정책을 홈페이지 첫 화면에
              공개함으로써 귀하께서 언제나 용이하게 보실 수 있도록 조치하고
              있습니다. 본 개인정보처리방침은 정부의 법령 및 지침의 변경, 또는
              보다 나은 서비스의 제공을 위해 그 내용이 변경될 수 있으므로 사이트
              방문 시 수시로 그 내용을 확인하여 주시기 바랍니다.
            </p>
          </section>

          <div className="bg-blue-50 p-4 rounded mt-16 mb-8">
            <h3 className="text-2xl font-semibold mb-2">[회원고객 개인정보]</h3>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. 개인정보의 수집범위
            </h2>
            <p className="mb-4">
              사단법인 토브협회는 별도의 회원가입 절차 없이 대부분의 컨텐츠에
              자유롭게 접근할 수 있습니다. 사단법인 토브협회는 회원제 서비스를
              이용하시고자 할 경우 다음의 정보를 입력해주셔야 하며 선택항목을
              입력하시지 않았다 하여 서비스 이용에 제한은 없습니다.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">① 최초신청시 개인정보의 범위</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>
                    필수항목 : 희망 ID, 비밀번호, 성명, 주소, 휴대 전화번호,
                    이메일주소
                  </li>
                  <li>선택항목 : 일반전화 번호, 자기소개</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">
                  ② 후원회원 가입시 개인정보의 범위
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>
                    필수항목: 이름, 휴대전화번호 혹은 이메일,
                    후원금결제정보(신용카드: 신용카드 결제정보, 본인인증 정보
                    등/ 실시간 계좌이체: 금융결제원 계좌이체 전용 어플 설치,
                    어플 내 결제정보/ 일반 계좌이체: 은행명, 계좌번호 등)
                  </li>
                  <li>
                    선택항목: 유선전화, 집 혹은 직장주소, 소식수신(SMS, 이메일,
                    우편물), 성별, 생년월일, 기부금영수증 정보
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">③ 일시후원시 개인정보의 범위</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>
                    필수항목: 이름, 휴대전화번호 혹은 이메일,
                    후원금결제정보(신용카드: 신용카드 결제정보, 본인인증 정보
                    등/ 실시간 계좌이체: 금융결제원 계좌이체 전용 어플 설치,
                    어플 내 결제정보/ 일반 계좌이체: 은행명, 계좌번호 등)
                  </li>
                  <li>
                    선택항목: 유선전화, 집 혹은 직장주소, 소식수신(SMS, 이메일,
                    우편물), 성별, 생년월일, 기부금영수증 정보
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">④ 행사 참여시 개인정보의 범위</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>필수항목: 이름, 이메일, 휴대전화번호</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">
                  ⑤ IP Address, 쿠키, 방문 일시, 서비스 이용 기록
                </p>
                <p className="ml-6 mt-2">
                  웹서비스 이용과정에서 위와 같은 정보들이 자동으로 생성되어
                  수집될 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. 개인정보 수집에 대한 동의
            </h2>
            <p className="mb-4">
              사단법인 토브협회는 귀하께서 사단법인 토브협회의 개인정보보호방침
              또는 이용약관의 내용에 대해 「동의한다」버튼 또는 「동의하지
              않는다」버튼을 클릭할 수 있는 절차를 마련하여, 「동의한다」버튼을
              클릭하면 개인정보 수집에 대해 동의한 것으로 봅니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. 개인정보의 수집목적 및 이용목적
            </h2>
            <p className="mb-4">
              ① 사단법인 토브협회는 다음과 같은 목적을 위하여 개인정보를
              수집하고 있습니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>본인 식별: 이름, 이메일주소 또는 휴대폰번호</li>
              <li>안내사항 전달, 의사소통 경로 확보: 이메일주소, 휴대폰번호</li>
              <li>후원금결제: CMS 혹은 신용카드/체크카드 결제정보</li>
              <li>
                기부금영수증 발급: 기부자 이름, 기부자 주민등록번호,
                주민등록지주소, 후원정보
              </li>
              <li>회원소식지 등 우편물발송: 이름, 우편물 수령주소</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              5. 쿠키에 의한 개인정보 수집
            </h2>
            <p className="mb-4 font-semibold">① 쿠키(cookie)란?</p>
            <p className="mb-4">
              사단법인 토브협회는 귀하에 대한 정보를 저장하고 수시로 찾아내는
              쿠키(cookie)를 사용합니다. 쿠키는 웹사이트가 귀하의 컴퓨터
              브라우저(넷스케이프, 인터넷 익스플로러 등)로 전송하는 소량의
              정보입니다. 귀하께서 웹사이트에 접속을 하면 사단법인 토브협회의
              컴퓨터는 귀하의 브라우저에 있는 쿠키의 내용을 읽고, 귀하의
              추가정보를 귀하의 컴퓨터에서 찾아 접속에 따른 성명 등의 추가 입력
              없이 서비스를 제공할 수 있습니다. 쿠키는 귀하의 컴퓨터는
              식별하지만 귀하를 개인적으로 식별하지는 않습니다. 또한 귀하는
              쿠키에 대한 선택권이 있습니다. 웹 브라우저 상단의 도구 &gt; 인터넷
              옵션 탭(option tab)에서 모든 쿠키를 다 받아들이거나, 쿠키가 설치될
              때 통지를 보내도록 하거나, 아니면 모든 쿠키를 거부할 수 있는
              선택권을 가질 수 있습니다.
            </p>
            <p className="mb-4 font-semibold">
              ② 사단법인 토브협회의 쿠키(cookie) 운용
            </p>
            <p className="mb-4">
              사단법인 토브협회는 이용자의 편의를 위하여 쿠키를 운영합니다.
              사단법인 토브협회는 쿠키를 통해 수집하는 정보는 회원 ID에 한하며,
              그 외의 다른 정보는 수집하지 않습니다. 사단법인 토브협회가
              쿠키(cookie)를 통해 수집한 회원 ID는 다음의 목적을 위해
              사용됩니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>회원전용 페이지 저장을 위한 ID 저장</li>
              <li>
                회원과 비회원의 접속 빈도 또는 머문 시간 등을 분석하여 이용자의
                취향과 관심분야를 파악하여 타겟(target) 마케팅에 활용
              </li>
              <li>쿠키는 브라우저의 종료시나 로그아웃시 만료됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              6. 목적외 사용 및 제3자에 대한 제공 및 공유
            </h2>
            <p className="mb-4">
              ① 사단법인 토브협회는 귀하의 개인정보를 &lt;개인정보의 수집목적 및
              이용목적&gt;에서 고지한 범위내에서 사용하며, 동 범위를 초과하여
              이용하거나 타인 또는 타기업·기관에 제공하지 않습니다.
            </p>
            <p className="mb-4">
              ② 고지 및 동의방법은 온라인 홈페이지 최기화면의 공지사항을 통해
              최소 30일 이전부터 고지함과 동시에 이메일 등을 이용하여 1회 이상
              개별적으로 고지하고 매각·인수합병에 대해서는 반드시 적극적인 동의
              방법(개인정보의 제 3자 제공 및 공유에 대한 의사를 직접 밝힘)에
              의해서만 절차를 진행합니다.
            </p>
            <p className="mb-4">③ 다음은 예외로 합니다.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                관계법령에 의하여 수사상의 목적으로 관계기관으로부터의 요구가
                있을 경우
              </li>
              <li>
                통계작성·학술연구나 시장조사를 위하여 특정 개인을 식별할 수 없는
                형태로 광고주·협력사나 연구단체 등에 제공하는 경우
              </li>
              <li>기타 관계법령에서 정한 절차에 따른 요청이 있는 경우</li>
            </ul>
            <p className="mt-4">
              그러나 예외 사항에서도 관계법령에 의하거나 수사기관의 요청에 의해
              정보를 제공한 경우에는 이를 당사자에게 고지하는 것을 원칙으로
              운영하고 있습니다. 법률상의 근거에 의해 부득이하게 고지를 하지
              못할 수도 있습니다. 본래의 수집목적 및 이용목적에 반하여
              무분별하게 정보가 제공되지 않도록 최대한 노력하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              7. 개인정보의 열람, 정정
            </h2>
            <p className="mb-4">
              ① 귀하는 언제든지 등록되어 있는 귀하의 개인정보를 열람하거나 정정
              하실 수 있습니다. 개인정보 열람 및 정정을 하고자 할 경우에는
              『개인정보변경』을 클릭하여 직접 열람 또는 정정하거나,
              개인정보관리책임자 및 담당자에게 서면, 전화 또는 E-mail로
              연락하시면 지체없이 조치하겠습니다.
            </p>
            <p className="mb-4">
              ② 귀하가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을
              완료하기 전까지 당해 개인 정보를 이용 또는 제공하지 않습니다.
            </p>
            <p className="mb-4">
              ③ 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를
              제3자에게 지체없이 통지하여 정정하도록 조치하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              8. 개인정보 수집, 이용, 제공에 대한 동의철회
            </h2>
            <p className="mb-4">
              ① 회원가입 등을 통해 개인정보의 수집, 이용, 제공에 대해 귀하께서
              동의하신 내용을 귀하는 언제든지 철회하실 수 있습니다. 동의철회는
              홈페이지 첫 화면의 『회원가입/수정』을 클릭하거나
              개인정보관리책임자에게 서면, 전화, E-mail등으로 연락하시면 즉시
              개인정보의 삭제 등 필요한 조치를 하겠습니다. 동의 철회를 하고
              개인정보를 파기하는 등의 조치를 취한 경우에는 그 사실을 귀하께
              지체없이 통지하도록 하겠습니다.
            </p>
            <p className="mb-4">
              ② 사단법인 토브협회는 개인정보의 수집에 대한 동의철회(회원탈퇴)를
              개인정보를 수집하는 방법보다 쉽게 할 수 있도록 필요한 조치를
              취하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              9. 개인정보의 보유기간 및 이용기간
            </h2>
            <p className="mb-4">
              ① 귀하의 개인정보는 다음과 같이 개인정보의 수집목적 또는 제공받은
              목적이 달성되면 파기됩니다. 단, 상법 등 법령의 규정에 의하여
              보존할 필요성이 있는 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                회원가입정보의 경우, 회원가입을 탈퇴하거나 회원에서 제명된 때
              </li>
              <li>
                대금지급정보의 경우, 대금의 완제일 또는 채권소멸시효기간이
                만료된 때
              </li>
              <li>배송정보의 경우, 물품 또는 서비스가 인도되거나 제공된 때</li>
            </ul>
            <p className="mb-4 mt-4">
              ② 위 개인정보 수집목적 달성시 즉시파기 원칙에도 불구하고 다음과
              같이 거래 관련 권리 의무 관계의 확인 등을 이유로 일정기간
              보유하여야 할 필요가 있을 경우에는
              전자상거래등에서의소비자보호에관한법률등에 근거하여 일정기간
              보유합니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>계약 또는 청약철회 등에 관한 기록 : 5년</li>
              <li>대금결제 및 재화등의 공급에 관한 기록 : 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
            </ul>
            <p className="mb-4 mt-4">
              ③ 귀하의 동의를 받아 보유하고 있는 거래정보등을 귀하께서 열람을
              요구하는 경우 사단법인 토브협회는 지체없이 그 열람·확인 할 수
              있도록 조치합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. 게시물</h2>
            <p className="mb-4">
              ① 사단법인 토브협회는 귀하의 게시물을 소중하게 생각하며 변조,
              훼손, 삭제되지 않도록 최선을 다하여 보호합니다. 그러나 다음의
              경우는 그렇지 아니합니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>스팸(spam)성 게시물</li>
              <li>
                타인을 비방할 목적으로 허위 사실을 유포하여 타인의 명예를
                훼손하는 글
              </li>
              <li>
                동의 없는 타인의 신상공개, 제 3자의 저작권 등 권리를 침해하는
                내용, 기타 게시판 주제와 다른 내용의 게시물
              </li>
              <li>
                그 외의 경우 명시적 또는 개별적인 경고 후 삭제 조치할 수
                있습니다.
              </li>
            </ul>
            <p className="mb-4 mt-4">
              ② 근본적으로 게시물에 관련된 제반 권리와 책임은 작성자 개인에게
              있습니다. 또 게시물을 통해 자발적으로 공개된 정보는 보호받기
              어려우므로 정보 공개 전에 심사숙고하시기 바랍니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              11. 아동의 개인정보보호
            </h2>
            <p className="mb-4">
              사단법인 토브협회는 만 14세 미만 아동의 개인정보를 보호하기 위하여
              만 14세 미만의 아동은 회원으로 가입할수 없습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              12. 이용자의 권리와 의무
            </h2>
            <p className="mb-4">
              ① 귀하의 개인정보를 최신의 상태로 정확하게 입력하여 불의의 사고를
              예방해 주시기 바랍니다. 이용자가 입력한 부정확한 정보로 인해
              발생하는 사고의 책임은 이용자 자신에게 있으며 타인 정보의 도용 등
              허위정보를 입력할 경우 회원자격이 상실될 수 있습니다.
            </p>
            <p className="mb-4">
              ② 귀하는 개인정보를 보호받을 권리와 함께 스스로를 보호하고 타인의
              정보를 침해하지 않을 의무도 가지고 있습니다. 비밀번호를 포함한
              귀하의 개인정보가 유출되지 않도록 조심하시고 게시물을 포함한
              타인의 개인정보를 훼손하지 않도록 유의해 주십시오. 만약 이 같은
              책임을 다하지 못하고 타인의 정보 및 존엄성을 훼손할 시에는
              『정보통신망이용촉진및정보보호등에관한법률』등에 의해 처벌받을 수
              있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. 고지의 의무</h2>
            <p className="mb-4">
              현 개인정보보호정책은 2025년 9월 23일에 제정되었으며 정부의 정책
              또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는
              개정 최소 10일 전부터 홈페이지의 '공지'란을 통해 고지할 것입니다.
            </p>
          </section>

          <div className="bg-blue-50 p-4 rounded mt-16 mb-8">
            <h3 className="text-2xl font-semibold mb-2">
              [회원개인정보 보안대책]
            </h3>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              14. 개인정보보호를 위한 기술 및 관리적 대책
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">① 기술적 대책</p>
                <p className="mb-2">
                  사단법인 토브협회는 귀하의 개인정보를 취급함에 있어 개인정보가
                  분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를
                  위하여 다음과 같은 기술적 대책을 강구하고 있습니다.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    귀하의 개인정보는 비밀번호에 의해 보호되며, 파일 및 전송
                    데이터를 암호화하여 일반사용자 및 관리자가 접근할 수
                    없습니다.
                  </li>
                  <li>
                    사단법인 토브협회는 백신프로그램을 이용하여 컴퓨터바이러스에
                    의한 피해를 방지하기 위한 조치를 취하고 있습니다.
                    백신프로그램은 주기적으로 업데이트하여 바이러스에 대처하고
                    있습니다
                  </li>
                  <li>
                    사단법인 토브협회는 보안을 위하여 서버 보안 업데이트
                    주기적으로 실시하고 있습니다
                  </li>
                  <li>
                    해킹 등 외부 침입에 대비하여 각 서버마다 침입차단시스템 및
                    취약점 분석 시스템 등을 이용하여 보안에 만전을 기하고
                    있습니다.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">② 관리적 대책</p>
                <p className="mb-2">
                  사단법인 토브협회는 귀하의 개인정보에 대한 접근권한을 최소한의
                  인원으로 제한하고 있습니다. 그 최소한의 인원에 해당하는 자는
                  다음과 같습니다.
                </p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                  <li>이용자를 직접 상대로 하여 마케팅 업무를 수행하는 자</li>
                  <li>
                    개인정보관리책임자 및 담당자 등 개인정보관리업무를 수행하는
                    자
                  </li>
                  <li>기타 업무상 개인정보의 취급이 불가피한 자</li>
                </ul>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    개인정보를 취급하는 직원을 대상으로 새로운 보안 기술 습득 및
                    개인정보 보호 의무 등에 관해 정기적인 사내 교육 및 외부
                    위탁교육을 실시하고 있습니다.
                  </li>
                  <li>
                    입사 시 전 직원의 보안서약서를 통하여 사람에 의한 정보유출을
                    사전에 방지하고 개인정보보호정책에 대한 이행사항 및 직원의
                    준수여부를 감사하기 위한 내부절차를 마련하고 있습니다.
                  </li>
                  <li>
                    개인정보 관련 취급자의 업무 인수인계는 보안이 유지된
                    상태에서 철저하게 이뤄지고 있으며 입사 및 퇴사 후 개인정보
                    사고에 대한 책임을 명확화하고 있습니다.
                  </li>
                  <li>
                    사단법인 토브협회는 이용자 개인의 실수나 기본적인 인터넷의
                    위험성 때문에 일어나는 일들에 대해 책임을 지지 않습니다.
                    회원 개개인이 본인의 개인정보를 보호하기 위해서 자신의 ID 와
                    비밀번호를 적절하게 관리하고 여기에 대한 책임을 져야 합니다.
                  </li>
                  <li>
                    그 외 내부 관리자의 실수나 기술관리 상의 사고로 인해
                    개인정보의 상실, 유출, 변조, 훼손이 유발될 경우 사단법인
                    토브협회는 즉각 귀하께 사실을 알리고 적절한 대책과 보상을
                    강구할 것입니다.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-blue-50 p-4 rounded mt-16 mb-8">
            <h3 className="text-2xl font-semibold mb-2">
              [개인정보 관리책임자]
            </h3>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              15. 개인정보의 보호책임자
            </h2>
            <p className="mb-4">
              사단법인 토브협회는 귀하가 좋은 정보를 안전하게 이용할 수 있도록
              최선을 다하고 있습니다. 개인정보를 보호하는데 있어 귀하께 고지한
              사항들에 반하는 사고가 발생할 시에 개인정보관리책임자가 모든
              책임을 집니다. 그러나 기술적인 보완조치를 했음에도 불구하고, 해킹
              등 기본적인 네트워크상의 위험성에 의해 발생하는 예기치 못한 사고로
              인한 정보의 훼손 및 방문자가 작성한 게시물에 의한 각종 분쟁에
              관해서는 책임이 없습니다. 귀하의 개인정보를 취급하는 책임자 및
              담당자는 다음과 같으며 개인정보 관련 문의사항에 신속하고 성실하게
              답변해드리고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="font-semibold mb-2">개인정보보호담당자</p>
              <ul className="space-y-1">
                <li>이름: 이헌주</li>
                <li>소속: 사무국</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="font-semibold mb-2">개인정보보호책임자</p>
              <ul className="space-y-1">
                <li>이름: 최호윤</li>
                <li>소속: 이사장</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">개인정보보호 관련 연락처</p>
              <ul className="space-y-1">
                <li>전화: 02-6951-1391</li>
                <li>E-mail: tov.npo@gmail.com</li>
              </ul>
            </div>
          </section>

          <div className="bg-blue-50 p-4 rounded mt-16 mb-8">
            <h3 className="text-2xl font-semibold mb-2">
              [개인정보 보호 문의처]
            </h3>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              16. 의견수렴 및 불만처리
            </h2>
            <p className="mb-4">
              ① 당사는 귀하의 의견을 소중하게 생각하며, 귀하는 의문사항으로부터
              언제나 성실한 답변을 받을 권리가 있습니다.
            </p>
            <p className="mb-4">
              ② 전자우편이나 팩스 및 우편을 이용한 상담은 접수 후 24시간 내에
              성실하게 답변 드리겠습니다. 다만, 근무시간 이후 또는 주말 및
              공휴일에는 익일 처리하는 것을 원칙으로 합니다.
            </p>
            <p className="mb-4">
              ③ 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래
              기관에 문의하시기 바랍니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>개인정보침해신고센터 (www.118.or.kr/118)</li>
              <li>정보보호마크인증위원회 (www.eprivacy.or.kr/02-580-0533~4)</li>
              <li>대검찰청 첨단범죄수사과 (www.spo.go.kr/02-3480-2000)</li>
              <li>경찰청 사이버테러대응센터 (www.ctrc.go.kr/02-392-0330)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
