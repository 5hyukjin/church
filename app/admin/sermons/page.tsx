import { getCurrentUser } from '@/lib/auth'
import { SermonForm } from '@/components/sermon-form'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'user@test.com'

export default async function AdminSermonsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect('/sermons')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">주보 관리</h1>
        <p className="text-gray-600 mb-8">새로운 주보를 등록합니다</p>

        <div className="bg-white rounded-lg shadow p-6">
          <SermonForm />
        </div>
      </div>
    </div>
  )
}
