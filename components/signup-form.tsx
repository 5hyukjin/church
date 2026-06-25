'use client'

import { useState } from 'react'
import { signUp } from '@/lib/actions/auth-actions'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('passwordConfirm', passwordConfirm)
      await signUp(formData)

      // signUp이 성공하면 redirect되지만, 혹시를 대비해 메시지 표시
      setSuccessMessage(
        `회원가입 이메일이 ${email}로 발송되었습니다. 이메일을 확인하여 계정을 활성화해주세요.`
      )
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 실패')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="p-4 bg-blue-100 text-blue-700 rounded-lg">
          <p className="font-semibold mb-2">✓ 회원가입 성공</p>
          <p className="text-sm">{successMessage}</p>
          <p className="text-sm mt-2">
            이메일에서 확인 링크를 클릭한 후 로그인해주세요.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting || !!successMessage}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting || !!successMessage}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="••••••"
        />
        <p className="text-xs text-gray-500 mt-1">최소 6자 이상</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          disabled={isSubmitting || !!successMessage}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !!successMessage}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isSubmitting ? '가입중...' : '회원가입'}
      </button>

      <p className="text-center text-gray-600">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          로그인
        </a>
      </p>
    </form>
  )
}
