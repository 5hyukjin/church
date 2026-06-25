import 'server-only'

import { getSupabaseServerClient } from './supabase-server'

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return data.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in')
  }
  return user
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', userId)
    .single()

  if (error) {
    return false
  }

  return !!data
}

export async function requireAdmin() {
  const user = await requireAuth()
  const admin = await isAdmin(user.id)
  
  if (!admin) {
    throw new Error('관리자만 접근 가능합니다')
  }
  
  return user
}
