'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'

export interface Sermon {
  id: string
  date: string
  worship_order: string | null
  youth_news: string | null
  sermon_title: string | null
  sermon_scripture: string | null
  sermon_preacher: string | null
  created_at: string
  created_by: string
}

export async function getSermons() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('주보 조회 실패:', error)
    return []
  }

  return (data as Sermon[]) || []
}

export async function getSermonById(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('주보 조회 실패:', error)
    return null
  }

  return (data as Sermon) || null
}
