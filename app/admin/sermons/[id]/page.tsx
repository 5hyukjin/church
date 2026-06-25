import { getCurrentUser } from '@/lib/auth'
import { getSermonById } from '@/lib/actions/sermon-queries'
import { EditSermonForm } from '@/components/edit-sermon-form'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const ADMIN_EMAIL = 'user@test.com'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditSermonPage({ params }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { isAdmin } = require('@/lib/auth')
  const userIsAdmin = await isAdmin(user.id)

  if (!userIsAdmin) {
    redirect('/sermons')
  }

  const { id } = await params
  const sermon = await getSermonById(id)

  if (!sermon) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAdmin={userIsAdmin} />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">주보 수정</h1>
        <p className="text-gray-600 mb-8">{sermon.date} 주보를 수정합니다</p>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <EditSermonForm sermon={sermon} />
        </div>

        {/* 하단 버튼 */}
        <Link
          href="/admin/sermons"
          className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 font-medium"
        >
          ← 돌아가기
        </Link>
      </div>

      <Footer />
    </div>
  )
}
