'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { FileText, CheckCircle, AlertTriangle, Users, Shield, Scale } from 'lucide-react'

export default function TermsOfServicePage() {
  const sections = [
    {
      id: 'chapter1',
      title: '제1장 총칙',
      icon: <FileText className="h-5 w-5" />,
      articles: [
        {
          title: '제1조 (목적)',
          content: `이 약관은 씨엠웨이(주)(이하 "회사"라 합니다)가 운영하는 웹사이트 및 관련 서비스(이하 "서비스"라 합니다)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`
        },
        {
          title: '제2조 (정의)',
          content: `① "서비스"란 회사가 제공하는 건강기능식품 정보 제공, 상담, 제품 안내 등 일체의 서비스를 의미합니다.
② "이용자"란 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.`
        },
        {
          title: '제3조 (약관의 명시와 개정)',
          content: `① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
② 회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.`
        }
      ]
    },
    {
      id: 'chapter2',
      title: '제2장 회원가입 및 서비스 이용',
      icon: <Users className="h-5 w-5" />,
      articles: [
        {
          title: '제4조 (회원가입)',
          content: `① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다.
  1. 등록 내용에 허위, 기재누락, 오기가 있는 경우
  2. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우`
        },
        {
          title: '제5조 (서비스의 제공 및 변경)',
          content: `① 회사는 다음과 같은 서비스를 제공합니다.
  1. 건강기능식품 정보 제공 서비스
  2. 건강 상담 서비스
  3. 제품 문의 및 상담 서비스
  4. 기타 회사가 정하는 서비스
② 회사는 서비스의 내용을 변경할 경우에는 변경사유 및 내용을 이용자에게 통지합니다.`
        },
        {
          title: '제6조 (서비스의 중단)',
          content: `① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
② 제1항에 의한 서비스 중단의 경우에는 회사는 이용자에게 통지합니다. 다만, 회사가 통제할 수 없는 사유로 인한 서비스의 중단으로 인하여 사전 통지가 불가능한 경우에는 그러하지 아니합니다.`
        }
      ]
    },
    {
      id: 'chapter3',
      title: '제3장 개인정보보호',
      icon: <Shield className="h-5 w-5" />,
      articles: [
        {
          title: '제7조 (개인정보보호)',
          content: `① 회사는 이용자의 개인정보를 보호하기 위하여 개인정보보호법 등 관련 법령을 준수합니다.
② 회사의 개인정보 처리방침은 별도로 정하는 바에 따르며, 서비스 초기 화면에 공지합니다.
③ 회사는 이용자의 개인정보를 본인의 동의 없이 제3자에게 제공하지 않습니다.`
        },
        {
          title: '제8조 (회원의 ID 및 비밀번호 관리)',
          content: `① ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 회사에 통보하고 회사의 안내가 있는 경우에는 그에 따라야 합니다.`
        }
      ]
    },
    {
      id: 'chapter4',
      title: '제4장 의무 및 책임',
      icon: <Scale className="h-5 w-5" />,
      articles: [
        {
          title: '제9조 (회사의 의무)',
          content: `① 회사는 관련 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.
② 회사는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보보호를 위한 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
③ 회사는 이용자의 개인정보를 본인의 승낙 없이 타인에게 누설, 배포하지 않습니다.`
        },
        {
          title: '제10조 (회원의 의무)',
          content: `① 회원은 다음 행위를 하여서는 안됩니다.
  1. 신청 또는 변경 시 허위내용의 등록
  2. 타인의 정보도용
  3. 회사가 게시한 정보의 변경
  4. 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해
  5. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
② 회원은 관련 법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 합니다.`
        }
      ]
    },
    {
      id: 'chapter5',
      title: '제5장 기타',
      icon: <AlertTriangle className="h-5 w-5" />,
      articles: [
        {
          title: '제11조 (저작권의 귀속)',
          content: `① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
② 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.`
        },
        {
          title: '제12조 (분쟁의 해결)',
          content: `① 회사와 이용자 간에 발생한 서비스 이용에 관한 분쟁에 대하여는 양 당사자 간의 합의에 의해 원만히 해결함을 원칙으로 합니다.
② 제1항의 규정에도 불구하고 분쟁이 해결되지 않을 경우 양 당사자는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.`
        },
        {
          title: '제13조 (약관의 효력)',
          content: `이 약관은 2025년 1월 8일부터 시행합니다.`
        }
      ]
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
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                이용약관
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                씨엠웨이 서비스 이용에 관한 약관입니다
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 p-6 bg-gray-50 rounded-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">목차</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>{chapter.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Chapters */}
            <div className="space-y-16">
              {sections.map((chapter, chapterIndex) => (
                <motion.div
                  key={chapter.id}
                  id={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: chapterIndex * 0.1 }}
                >
                  {/* Chapter Title */}
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-emerald-500">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      {chapter.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {chapter.title}
                    </h2>
                  </div>

                  {/* Articles */}
                  <div className="space-y-8">
                    {chapter.articles.map((article, articleIndex) => (
                      <motion.div
                        key={articleIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: articleIndex * 0.05 }}
                        className="pl-6 border-l-2 border-gray-200 hover:border-emerald-300 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {article.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {article.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Agreement Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-16 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl text-center"
            >
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                약관 동의 안내
              </h3>
              <p className="text-gray-700 mb-6">
                회원가입 시 본 약관에 동의하는 것으로 간주됩니다.<br />
                약관에 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors">
                  동의합니다
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-colors">
                  돌아가기
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}