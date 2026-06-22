import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MypageForm } from '@/components/mypage-form'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth-actions'

export default async function MypagePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← 돌아가기
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">반원중앙교회</h1>
            <p className="text-gray-600 text-sm">청년부 설교 노트</p>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h2>

        <MypageForm userEmail={user.email || ''} />
      </main>
    </div>
  )
}
