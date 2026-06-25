import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SermonList } from '@/components/sermon-list'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function SermonsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const userIsAdmin = await isAdmin(user.id)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAdmin={userIsAdmin} />

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">주보 목록</h2>
        <SermonList isAdmin={userIsAdmin} />
      </main>

      <Footer />
    </div>
  )
}
