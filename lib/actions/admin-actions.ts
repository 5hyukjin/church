'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'

interface AuthUser {
  id: string
  email: string
  created_at: string
}

export async function getAllAuthUsers() {
  await requireAdmin() // 관리자만 접근 가능

  const supabase = await getSupabaseAdminClient()

  // admin 클라이언트로 모든 사용자 조회
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    throw new Error(`사용자 조회 실패: ${error.message}`)
  }

  return (data?.users || []).map((user) => ({
    id: user.id,
    email: user.email || '',
    created_at: user.created_at,
  }))
}

export async function getAdmins() {
  await requireAdmin()

  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('admins')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`관리자 조회 실패: ${error.message}`)
  }

  return data || []
}

export async function grantAdmin(userId: string, email: string) {
  await requireAdmin()

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from('admins').insert({
    id: userId,
    email: email,
  })

  if (error) {
    if (error.message.includes('duplicate')) {
      throw new Error('이미 관리자입니다')
    }
    throw new Error(`관리자 권한 부여 실패: ${error.message}`)
  }

  revalidatePath('/admin/users')
}

export async function revokeAdmin(userId: string) {
  await requireAdmin()

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from('admins').delete().eq('id', userId)

  if (error) {
    throw new Error(`관리자 권한 회수 실패: ${error.message}`)
  }

  revalidatePath('/admin/users')
}
