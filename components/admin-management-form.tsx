'use client'

import { useState, useEffect } from 'react'
import { getAllAuthUsers, getAdmins, grantAdmin, revokeAdmin } from '@/lib/actions/admin-actions'

interface User {
  id: string
  email: string
  created_at: string
}

interface Admin {
  id: string
  email: string
  created_at: string
}

export function AdminManagementForm() {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [users, adminList] = await Promise.all([
        getAllAuthUsers(),
        getAdmins(),
      ])
      setAllUsers(users as User[])
      setAdmins(adminList as Admin[])
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '데이터 로드 실패'}`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGrantAdmin = async (userId: string, email: string) => {
    setIsSubmitting(true)
    setMessage('')

    try {
      await grantAdmin(userId, email)
      setMessage(`${email}에 관리자 권한을 부여했습니다`)
      await loadData()
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '권한 부여 실패'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevokeAdmin = async (userId: string, email: string) => {
    if (!confirm(`${email}의 관리자 권한을 회수하시겠습니까?`)) {
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      await revokeAdmin(userId)
      setMessage(`${email}의 관리자 권한을 회수했습니다`)
      await loadData()
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '권한 회수 실패'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">로드중...</div>
  }

  const nonAdminUsers = allUsers.filter(
    (user) => !admins.some((admin) => admin.id === user.id)
  )

  return (
    <div className="space-y-8">
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

      {/* 현재 관리자 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          현재 관리자 ({admins.length})
        </h2>
        {admins.length === 0 ? (
          <p className="text-gray-600">관리자가 없습니다</p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{admin.email}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(admin.created_at).toLocaleDateString('ko-KR')}에 추가됨
                  </p>
                </div>
                <button
                  onClick={() => handleRevokeAdmin(admin.id, admin.email)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 text-sm font-medium"
                >
                  권한 회수
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 관리자로 추가할 사용자 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          관리자 권한 부여 ({nonAdminUsers.length})
        </h2>
        {nonAdminUsers.length === 0 ? (
          <p className="text-gray-600">관리자로 추가할 사용자가 없습니다</p>
        ) : (
          <div className="space-y-3">
            {nonAdminUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}에 가입함
                  </p>
                </div>
                <button
                  onClick={() => handleGrantAdmin(user.id, user.email)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
                >
                  관리자 추가
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
