'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export interface Note {
  id: string
  sermon_id: string
  user_id: string
  content: string
  updated_at: string
}

export async function getOrCreateUserNote(sermonId: string) {
  const user = await requireAuth()
  const supabase = await getSupabaseServerClient()

  // 기존 노트 조회
  const { data: existingNote, error: queryError } = await supabase
    .from('notes')
    .select('*')
    .eq('sermon_id', sermonId)
    .eq('user_id', user.id)
    .single()

  if (!queryError && existingNote) {
    return (existingNote as Note) || null
  }

  // 없으면 새로 생성
  const { data: newNote, error: createError } = await supabase
    .from('notes')
    .insert({
      sermon_id: sermonId,
      user_id: user.id,
      content: '',
    })
    .select()
    .single()

  if (createError) {
    console.error('노트 생성 실패:', createError)
    return null
  }

  return (newNote as Note) || null
}

export async function updateUserNote(sermonId: string, content: string) {
  const user = await requireAuth()
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('notes')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('sermon_id', sermonId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`메모 저장 실패: ${error.message}`)
  }

  revalidatePath(`/sermons/${sermonId}`)
}
