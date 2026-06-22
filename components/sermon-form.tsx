'use client'

import { useState } from 'react'
import { createSermon } from '@/lib/actions/sermon-actions'

interface NewsItem {
  id: string
  title: string
  content: string
}

export function SermonForm() {
  const [date, setDate] = useState('')
  const [worshipOrder, setWorshipOrder] = useState('')
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [sermonTitle, setSermonTitle] = useState('')
  const [sermonScripture, setSermonScripture] = useState('')
  const [sermonPreacher, setSermonPreacher] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // 새 소식 항목 추가
  const addNewsItem = () => {
    const newItem: NewsItem = {
      id: Date.now().toString(),
      title: '',
      content: '',
    }
    setNewsItems([...newsItems, newItem])
  }

  // 소식 항목 제목 변경
  const updateNewsItemTitle = (id: string, title: string) => {
    setNewsItems(
      newsItems.map((item) => (item.id === id ? { ...item, title } : item))
    )
  }

  // 소식 항목 내용 변경
  const updateNewsItemContent = (id: string, content: string) => {
    setNewsItems(
      newsItems.map((item) => (item.id === id ? { ...item, content } : item))
    )
  }

  // 소식 항목 삭제
  const deleteNewsItem = (id: string) => {
    setNewsItems(newsItems.filter((item) => item.id !== id))
  }

  // 청년부 소식을 JSON 형태로 저장
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

      await createSermon(formData)

      setMessage('주보가 등록되었습니다!')
      setDate('')
      setWorshipOrder('')
      setNewsItems([])
      setSermonTitle('')
      setSermonScripture('')
      setSermonPreacher('')
    } catch (error) {
      setMessage(
        `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
    } finally {
      setIsSubmitting(false)
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
      <div>
        <label className="block text-sm font-medium mb-2">예배순서</label>
        <textarea
          value={worshipOrder}
          onChange={(e) => setWorshipOrder(e.target.value)}
          placeholder="1. 기도
2. 찬양
3. 설교
4. 기도
..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm h-40 resize-none"
        />
      </div>

      {/* 청년부 소식 */}
      <div className="pb-8 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <label className="block text-lg font-bold">청년부 소식</label>
          <button
            type="button"
            onClick={addNewsItem}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
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
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium"
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
                        updateNewsItemTitle(item.id, e.target.value)
                      }
                      placeholder="소식 제목"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      내용
                    </label>
                    <textarea
                      value={item.content}
                      onChange={(e) =>
                        updateNewsItemContent(item.id, e.target.value)
                      }
                      placeholder="소식 내용"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm h-24 resize-none"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isSubmitting ? '등록중...' : '주보 등록'}
      </button>
    </form>
  )
}
