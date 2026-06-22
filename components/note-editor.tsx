'use client'

import { useState, useEffect, useRef } from 'react'
import { updateUserNote } from '@/lib/actions/note-actions'

interface NoteEditorProps {
  sermonId: string
  initialContent: string
}

export function NoteEditor({ sermonId, initialContent }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved'
  )
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 자동 저장: 타이핑이 멈춘 1초 후 저장
  useEffect(() => {
    if (content === initialContent) {
      setSaveStatus('saved')
      return
    }

    setSaveStatus('unsaved')

    // 기존 타이머 취소
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // 새로운 타이머 설정
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving')
      setIsSaving(true)

      try {
        await updateUserNote(sermonId, content)
        setSaveStatus('saved')
      } catch (error) {
        console.error('저장 실패:', error)
        setSaveStatus('unsaved')
      } finally {
        setIsSaving(false)
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [content, sermonId, initialContent])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">나의 메모</label>
        <span
          className={`text-xs px-2 py-1 rounded ${
            saveStatus === 'saved'
              ? 'bg-green-100 text-green-700'
              : saveStatus === 'saving'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {saveStatus === 'saved' && '✓ 저장됨'}
          {saveStatus === 'saving' && '저장중...'}
          {saveStatus === 'unsaved' && '저장 안됨'}
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSaving}
        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none disabled:bg-gray-100"
        placeholder="설교를 들으면서 메모를 작성하세요. 자동으로 저장됩니다."
      />
      <p className="text-xs text-gray-500">
        자동 저장: 입력을 멈춘 후 1초 후에 자동으로 저장됩니다
      </p>
    </div>
  )
}
