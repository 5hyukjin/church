import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminManagementForm } from '@/components/admin-management-form'

export default async function AdminUsersPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">사용자 관리</h1>
        <p className="text-gray-600 mb-8">관리자 권한을 부여하거나 회수합니다</p>

        <AdminManagementForm />

        {/* 하단 버튼 */}
        <div className="mt-8">
          <Link
            href="/admin/sermons"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 font-medium"
          >
            ← 돌아가기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
