'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { requireAuth } from '@/lib/auth'

export async function uploadSermonImage(formData: FormData) {
  // 인증 체크
  const user = await requireAuth()

  const file = formData.get('file') as File

  if (!file) {
    throw new Error('파일을 선택해주세요')
  }

  // 파일 크기 체크 (5MB 제한)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('파일 크기는 5MB 이하여야 합니다')
  }

  const supabase = await getSupabaseServerClient()
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('sermon-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`)
  }

  // 공개 URL 반환
  const publicUrl = `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}/${fileName}`
  return publicUrl
}
