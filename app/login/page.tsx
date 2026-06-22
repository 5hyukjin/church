import { LoginForm } from '@/components/login-form'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/sermons')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-2">반원중앙교회</h1>
          <p className="text-center text-gray-600 mb-8">청년부 설교 노트</p>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
