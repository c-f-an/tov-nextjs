import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="mb-4">
              이 약관은 사단법인 토브협회(이하 "협회"라 합니다)가 운영하는 웹사이트에서 제공하는 
              모든 서비스(이하 "서비스"라 합니다)의 이용조건 및 절차, 이용자와 협회의 권리, 의무, 
              책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제2조 (약관의 효력과 변경)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>이 약관은 협회가 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.</li>
              <li>협회는 필요하다고 인정되는 경우 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 서비스 화면에 공지함으로써 이용자가 직접 확인할 수 있도록 할 것입니다.</li>
              <li>이용자는 변경된 약관에 동의하지 않으실 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
              <li>변경된 약관의 효력 발생일 이후의 계속적인 서비스 이용은 약관의 변경사항에 동의한 것으로 간주됩니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제3조 (약관 외 준칙)</h2>
            <p className="mb-4">
              이 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 
              정보보호 등에 관한 법률 및 기타 관련 법령의 규정에 의합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제4조 (용어의 정의)</h2>
            <p className="mb-4">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>"이용자"란 협회 사이트에 접속하여 이 약관에 따라 협회가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 협회에 개인정보를 제공하여 회원등록을 한 자로서, 협회의 정보를 지속적으로 제공받으며, 협회가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
              <li>"비회원"이란 회원에 가입하지 않고 협회가 제공하는 서비스를 이용하는 자를 말합니다.</li>
              <li>"상담서비스"란 비영리 회계 및 종교인 소득세 관련 전문 상담을 제공하는 서비스를 말합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제5조 (이용계약의 성립)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>이용계약은 이용자의 이용신청에 대한 협회의 승낙과 이용자의 약관 내용에 대한 동의로 성립됩니다.</li>
              <li>회원으로 가입하여 서비스를 이용하고자 하는 이용자는 협회가 요청하는 개인정보를 제공하여야 합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제6조 (서비스의 제공 및 변경)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>협회는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>비영리 회계 관련 정보 제공 및 상담</li>
                  <li>종교인 소득세 관련 정보 제공 및 상담</li>
                  <li>관련 법령 및 규정 정보 제공</li>
                  <li>교육 프로그램 운영</li>
                  <li>기타 협회가 정하는 서비스</li>
                </ul>
              </li>
              <li>협회는 서비스의 내용을 변경할 수 있으며, 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스 내용을 게시한 곳에 그 제공일자 7일 이전부터 공지합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제7조 (서비스의 중단)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>협회는 다음 각 호에 해당하는 경우 서비스 제공을 중지할 수 있습니다:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                  <li>기타 불가항력적 사유가 있는 경우</li>
                </ul>
              </li>
              <li>협회는 국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 불가능할 경우, 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제8조 (회원탈퇴 및 자격 상실)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>회원은 협회에 언제든지 탈퇴를 요청할 수 있으며, 협회는 즉시 회원탈퇴를 처리합니다.</li>
              <li>회원이 다음 각 호의 사유에 해당하는 경우, 협회는 회원자격을 제한 및 정지시킬 수 있습니다:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 협회 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>협회를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제9조 (이용자의 의무)</h2>
            <p className="mb-4">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보도용</li>
              <li>협회에 게시된 정보의 변경</li>
              <li>협회가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>협회 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>협회 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 협회에 공개 또는 게시하는 행위</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제10조 (저작권의 귀속 및 이용제한)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>협회가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 협회에 귀속합니다.</li>
              <li>이용자는 협회를 이용함으로써 얻은 정보 중 협회에게 지적재산권이 귀속된 정보를 협회의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제11조 (분쟁해결)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>협회는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</li>
              <li>협회는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제12조 (면책조항)</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>협회는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>협회는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
              <li>협회는 이용자가 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제13조 (관할법원)</h2>
            <p className="mb-4">
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 민사소송법상의 관할법원에 제기합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">부칙</h2>
            <p className="mb-4">
              이 약관은 2024년 1월 1일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}