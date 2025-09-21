import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from '@/presentation/components/common/PageHeader';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '개인정보처리방침' }]} />
      <div className="mx-auto">
        <PageHeader 
          title="개인정보처리방침"
          description="토브협회는 개인정보보호법에 따라 정보주체의 개인정보를 보호합니다."
        />
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 개인정보의 처리 목적</h2>
            <p className="mb-4">
              사단법인 토브협회(이하 '협회')는 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등</li>
              <li>상담 서비스 제공: 비영리 회계 및 종교인 소득세 관련 상담 서비스 제공</li>
              <li>후원금 관리: 후원자 관리, 후원금 영수증 발급, 기부금 영수증 발급</li>
              <li>교육 프로그램 운영: 교육 신청자 관리, 교육 이수증 발급</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <p className="mb-4">
              협회는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>상담 기록: 상담 종료 후 3년</li>
              <li>후원 기록: 기부금영수증 발급 관련 법령에 따라 5년</li>
              <li>교육 이수 기록: 교육 종료 후 3년</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 개인정보의 제3자 제공</h2>
            <p className="mb-4">
              협회는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 
              다음의 경우를 제외하고는 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>정보주체로부터 별도의 동의를 받는 경우</li>
              <li>법률에 특별한 규정이 있는 경우</li>
              <li>정보주체 또는 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="mb-4">정보주체는 협회에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 처리하는 개인정보 항목</h2>
            <p className="mb-4">협회는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>회원가입 시: 성명, 이메일 주소, 연락처, 비밀번호</li>
              <li>상담 신청 시: 성명, 연락처, 이메일 주소, 상담 내용</li>
              <li>후원 신청 시: 성명, 연락처, 주소, 이메일 주소, 후원 정보</li>
              <li>교육 신청 시: 성명, 연락처, 이메일 주소, 소속</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 개인정보의 파기</h2>
            <p className="mb-4">
              협회는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <p className="mb-4">개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>파기절차: 불필요한 개인정보 및 개인정보파일은 개인정보 보호책임자의 승인을 받아 파기합니다.</li>
              <li>파기방법: 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 개인정보 보호책임자</h2>
            <p className="mb-4">
              협회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">개인정보 보호책임자</p>
              <ul className="space-y-1">
                <li>성명: 홍길동</li>
                <li>직책: 사무국장</li>
                <li>연락처: 02-1234-5678</li>
                <li>이메일: privacy@tov.or.kr</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 개인정보처리방침 변경</h2>
            <p className="mb-4">
              이 개인정보처리방침은 2024년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}