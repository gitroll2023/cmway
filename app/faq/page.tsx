'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { ChevronDown, HelpCircle, Package, UserPlus, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FAQ {
  id: string
  category: string
  question: { ko: string; en: string }
  answer: { ko: string; en: string }
  display_order: number
  is_active: boolean
}

const categoryIcons: Record<string, React.ReactNode> = {
  '제품문의': <Package className="h-5 w-5" />,
  '배송문의': <Package className="h-5 w-5" />,
  '회원가입': <UserPlus className="h-5 w-5" />,
  '기타': <MessageSquare className="h-5 w-5" />
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const categories = ['all', '제품문의', '배송문의', '회원가입', '기타']
  
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

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
                <HelpCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                자주 묻는 질문
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                고객님들이 자주 문의하시는 내용을 모았습니다
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? '전체' : category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-lg h-20 animate-pulse" />
                ))}
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {categoryIcons[faq.category] || <HelpCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded mb-2">
                            {faq.category}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {faq.question.ko}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                          openItems.includes(faq.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="ml-14 text-gray-700 leading-relaxed whitespace-pre-line">
                              {faq.answer.ko}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                원하는 답변을 찾지 못하셨나요?
              </h3>
              <p className="text-gray-600 mb-6">
                고객센터로 문의하시면 친절하게 안내해드리겠습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:1588-0000"
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
                >
                  📞 1588-0000
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full border-2 border-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  문의하기
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}