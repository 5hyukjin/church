import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SermonForm } from '@/components/sermon-form'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function AdminSermonsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const userIsAdmin = await isAdmin(user.id)

  if (!userIsAdmin) {
    redirect('/sermons')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAdmin={userIsAdmin} />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">주보 관리</h1>
        <p className="text-gray-600 mb-8">새로운 주보를 등록합니다</p>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <SermonForm />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-4">
          <Link
            href="/sermons"
            className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 font-medium text-center"
          >
            ← 주보 목록
          </Link>
          <Link
            href="/admin/users"
            className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 font-medium text-center"
          >
            사용자 관리 →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
