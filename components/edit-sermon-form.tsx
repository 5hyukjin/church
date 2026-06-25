'use client'

import { useState } from 'react'
import { updateSermon, deleteSermon } from '@/lib/actions/sermon-actions'
import { useRouter } from 'next/navigation'
import { Sermon } from '@/lib/actions/sermon-queries'

interface NewsItem {
  id: string
  title: string
  content: string
}

interface WorshipItem {
  id: string
  order: number
  title: string
  content: string
}

export function EditSermonForm({ sermon }: { sermon: Sermon }) {
  const router = useRouter()
  const [date, setDate] = useState(sermon.date)
  const [worshipItems, setWorshipItems] = useState<WorshipItem[]>(() => {
    try {
      return sermon.worship_order ? JSON.parse(sermon.worship_order) : []
    } catch {
      return []
    }
  })
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try {
      return sermon.youth_news ? JSON.parse(sermon.youth_news) : []
    } catch {
      return []
    }
  })
  const [sermonTitle, setSermonTitle] = useState(sermon.sermon_title || '')
  const [sermonScripture, setSermonScripture] = useState(
    sermon.sermon_scripture || ''
  )
  const [sermonPreacher, setSermonPreacher] = useState(
    sermon.sermon_preacher || ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 예배순서 항목 추가
  const addWorshipItem = () => {
    const newItem: WorshipItem = {
      id: Date.now().toString(),
      order: worshipItems.length + 1,
      title: '',
      content: '',
    }
    setWorshipItems([...worshipItems, newItem])
  }

  // 예배순서 항목 삭제
  const deleteWorshipItem = (id: string) => {
    const newItems = worshipItems.filter((item) => item.id !== id)
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }))
    setWorshipItems(reorderedItems)
  }

  // 예배순서 항목 업데이트
  const updateWorshipItem = (
    id: string,
    field: 'title' | 'content',
    value: string
  ) => {
    setWorshipItems(
      worshipItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // 새 소식 항목 추가
  const addNewsItem = () => {
    const newItem: NewsItem = {
      id: Date.now().toString(),
      title: '',
      content: '',
    }
    setNewsItems([...newsItems, newItem])
  }

  // 소식 항목 삭제
  const deleteNewsItem = (id: string) => {
    setNewsItems(newsItems.filter((item) => item.id !== id))
  }

  // 소식 항목 업데이트
  const updateNewsItem = (
    id: string,
    field: 'title' | 'content',
    value: string
  ) => {
    setNewsItems(
      newsItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const worshipOrder = JSON.stringify(worshipItems)
  const youthNews = JSON.stringify(newsItems)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('date', date)
      formData.append('worshipOrder', worshipOrder)
      formData.append('youthNews', youthNews)
      formData.append('sermonTitle', sermonTitle)
      formData.append('sermonScripture', sermonScripture)
      formData.append('sermonPreacher', sermonPreacher)

      await updateSermon(sermon.id, formData)

      setMessage('주보가 수정되었습니다!')
      setTimeout(() => {
        router.push('/admin/sermons')
      }, 1000)
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await deleteSermon(sermon.id)
      router.push('/admin/sermons')
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* 날짜 */}
      <div>
        <label className="block text-sm font-medium mb-2">날짜 *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 예배순서 */}
      <div className="pb-8 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <label className="block text-lg font-bold">예배순서</label>
          <button
            type="button"
            onClick={addWorshipItem}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 text-sm font-medium"
          >
            + 항목 추가
          </button>
        </div>

        {worshipItems.length === 0 ? (
          <p className="text-gray-500 text-sm">
            항목을 추가하면 여기에 표시됩니다
          </p>
        ) : (
          <div className="space-y-6">
            {worshipItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-600">
                    {item.order}번째
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteWorshipItem(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                  >
                    삭제
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      예배 항목
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateWorshipItem(item.id, 'title', e.target.value)
                      }
                      placeholder="예: 경배와 찬양"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      세부 내용
                    </label>
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) =>
                        updateWorshipItem(item.id, 'content', e.target.value)
                      }
                      placeholder="예: 대단한 믿음 있어도... / 최선영 청년"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 청년부 소식 */}
      <div className="pb-8 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <label className="block text-lg font-bold">청년부 소식</label>
          <button
            type="button"
            onClick={addNewsItem}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 text-sm font-medium"
          >
            + 항목 추가
          </button>
        </div>

        {newsItems.length === 0 ? (
          <p className="text-gray-500 text-sm">
            항목을 추가하면 여기에 표시됩니다
          </p>
        ) : (
          <div className="space-y-6">
            {newsItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-600">
                    항목 {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteNewsItem(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                  >
                    삭제
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateNewsItem(item.id, 'title', e.target.value)
                      }
                      placeholder="소식 제목"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      내용
                    </label>
                    <textarea
                      value={item.content}
                      onChange={(e) =>
                        updateNewsItem(item.id, 'content', e.target.value)
                      }
                      placeholder="소식 내용"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 오늘의 말씀 */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-bold mb-6">오늘의 말씀</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">설교 제목</label>
            <input
              type="text"
              value={sermonTitle}
              onChange={(e) => setSermonTitle(e.target.value)}
              placeholder="예: 여호수아 같은 청년 공동체"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">본문 구절</label>
            <input
              type="text"
              value={sermonScripture}
              onChange={(e) => setSermonScripture(e.target.value)}
              placeholder="예: 고린도후서 13:5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">설교자</label>
            <input
              type="text"
              value={sermonPreacher}
              onChange={(e) => setSermonPreacher(e.target.value)}
              placeholder="설교자 이름"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 disabled:bg-gray-400 font-medium"
        >
          {isSubmitting ? '수정중...' : '주보 수정'}
        </button>

        {showDeleteConfirm ? (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium"
            >
              {isSubmitting ? '삭제중...' : '삭제 확인'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 font-medium"
            >
              취소
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            주보 삭제
          </button>
        )}
      </div>
    </form>
  )
}
