'use client'

import { useState } from 'react'
import { updatePassword, deleteAccount } from '@/lib/actions/auth-actions'

export function MypageForm({ userEmail }: { userEmail: string }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('newPassword', newPassword)
      formData.append('confirmPassword', confirmPassword)
      await updatePassword(formData)

      setMessage('비밀번호가 변경되었습니다!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await deleteAccount()
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 계정 정보 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">계정 정보</h2>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">이메일</label>
          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900 font-medium">
            {userEmail}
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
            <p className="text-xs text-gray-500 mt-1">최소 6자 이상</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.startsWith('오류')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {isSubmitting ? '변경중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>

      {/* 계정 삭제 */}
      <div className="bg-white rounded-lg shadow p-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">계정 삭제</h2>
        <p className="text-gray-600 text-sm mb-4">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
        </p>

        {showDeleteConfirm ? (
          <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-semibold text-red-700">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium"
              >
                {isSubmitting ? '삭제중...' : '계정 삭제 확인'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-400 font-medium"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDeleteAccount}
            className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            계정 삭제
          </button>
        )}
      </div>
    </div>
  )
}
