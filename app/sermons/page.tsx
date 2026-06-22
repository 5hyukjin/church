import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SermonList } from '@/components/sermon-list'
import { signOut } from '@/lib/actions/auth-actions'
import Link from 'next/link'

const ADMIN_EMAIL = 'user@test.com'

export default async function SermonsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.email === ADMIN_EMAIL

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">반원중앙교회</h1>
            <p className="text-gray-600 text-sm">청년부 설교 노트</p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin/sermons"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                주보 등록
              </Link>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 text-sm"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">주보 목록</h2>
        <SermonList />
      </main>
    </div>
  )
}
