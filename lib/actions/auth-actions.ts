'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string

  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요')
  }

  if (password !== passwordConfirm) {
    throw new Error('비밀번호가 일치하지 않습니다')
  }

  if (password.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다')
  }

  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    // Rate limit 에러인 경우 더 명확한 메시지
    if (error.message.includes('rate')) {
      throw new Error(
        '너무 많은 가입 시도가 있었습니다. 잠시 후에 다시 시도해주세요.'
      )
    }
    if (error.message.includes('invalid')) {
      throw new Error('유효한 이메일 주소를 입력해주세요')
    }
    throw new Error(`회원가입 실패: ${error.message}`)
  }

  // 회원가입 성공 시 확인 이메일이 발송됨
  // 클라이언트에서 메시지를 표시하고, redirect는 하지 않음
  // (사용자가 이메일을 확인할 때까지 기다림)
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요')
  }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`로그인 실패: ${error.message}`)
  }

  revalidatePath('/')
  redirect('/')
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()

  await supabase.auth.signOut()

  revalidatePath('/')
  redirect('/login')
}

export async function updatePassword(formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || !confirmPassword) {
    throw new Error('새 비밀번호를 입력해주세요')
  }

  if (newPassword !== confirmPassword) {
    throw new Error('비밀번호가 일치하지 않습니다')
  }

  if (newPassword.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다')
  }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(`비밀번호 변경 실패: ${error.message}`)
  }

  revalidatePath('/mypage')
}

export async function deleteAccount() {
  const supabase = await getSupabaseServerClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    throw new Error('사용자 정보를 가져올 수 없습니다')
  }

  const adminClient = await getSupabaseServerClient()

  // 일반 사용자는 자신의 계정만 삭제할 수 있으므로
  // 직접 auth를 통해 삭제 요청
  const { error } = await supabase.auth.admin.deleteUser(userData.user.id)

  if (error) {
    throw new Error(`계정 삭제 실패: ${error.message}`)
  }

  revalidatePath('/')
  redirect('/login?message=계정이 삭제되었습니다')
}
