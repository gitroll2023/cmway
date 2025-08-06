'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'section1',
      title: '1. 개인정보의 수집 및 이용목적',
      icon: <FileText className="h-5 w-5" />,
      content: `씨엠웨이는 수집한 개인정보를 다음의 목적을 위해 활용합니다.

• 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
• 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불만처리 등 민원처리, 고지사항 전달
• 마케팅 및 광고에 활용: 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달`
    },
    {
      id: 'section2',
      title: '2. 수집하는 개인정보 항목',
      icon: <UserCheck className="h-5 w-5" />,
      content: `회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

[필수항목]
• 성명, 생년월일, 성별, 연락처(휴대전화번호), 이메일

[선택항목]
• 주소, 건강 상태, 관심 제품

[자동 수집 항목]
• IP 주소, 쿠키, 방문 일시, 서비스 이용 기록`
    },
    {
      id: 'section3',
      title: '3. 개인정보의 보유 및 이용기간',
      icon: <Lock className="h-5 w-5" />,
      content: `원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

• 회원 정보: 회원 탈퇴 시까지
• 상담 기록: 3년
• 전자상거래 관련 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
• 접속 기록: 3개월 (통신비밀보호법)`
    },
    {
      id: 'section4',
      title: '4. 개인정보의 파기절차 및 방법',
      icon: <Shield className="h-5 w-5" />,
      content: `회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.

[파기절차]
• 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.

[파기방법]
• 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
• 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.`
    },
    {
      id: 'section5',
      title: '5. 개인정보 보호책임자',
      icon: <Eye className="h-5 w-5" />,
      content: `회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
• 성명: 김보호
• 직책: 정보보호팀장
• 연락처: 02-0000-0000
• 이메일: privacy@cmway.co.kr

정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.`
    },
    {
      id: 'section6',
      title: '6. 개인정보 처리방침 변경',
      icon: <AlertCircle className="h-5 w-5" />,
      content: `이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.

• 공고일자: 2025년 1월 1일
• 시행일자: 2025년 1월 8일`
    }
  ]

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                개인정보처리방침
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                씨엠웨이는 고객님의 개인정보를 안전하게 보호하고 있습니다
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              {/* Introduction */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 mb-12">
                <p className="text-gray-700 leading-relaxed mb-0">
                  <strong>씨엠웨이(주)</strong>(이하 &apos;회사&apos;라 한다)는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 
                  개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-l-4 border-emerald-500 pl-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 m-0">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-16 p-8 bg-gray-50 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  개인정보 침해신고
                </h3>
                <p className="text-gray-700 mb-4">
                  아래의 기관은 회사와는 별개의 기관으로서, 회사의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 
                  보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• 개인정보침해신고센터 (한국인터넷진흥원 운영): 118</li>
                  <li>• 개인정보분쟁조정위원회: 1833-6972</li>
                  <li>• 대검찰청 사이버수사과: 1301</li>
                  <li>• 경찰청 사이버수사국: 182</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}