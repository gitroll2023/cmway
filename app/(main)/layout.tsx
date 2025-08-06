import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}