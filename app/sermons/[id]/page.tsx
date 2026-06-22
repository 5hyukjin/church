import { getCurrentUser } from '@/lib/auth'
import { getSermonById } from '@/lib/actions/sermon-queries'
import { getOrCreateUserNote } from '@/lib/actions/note-actions'
import { NoteEditor } from '@/components/note-editor'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface NewsItem {
  id: string
  title: string
  content: string
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function SermonDetailPage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const sermon = await getSermonById(id)

  if (!sermon) {
    notFound()
  }

  const userNote = await getOrCreateUserNote(sermon.id)

  // 청년부 소식 파싱
  let newsItems: NewsItem[] = []
  if (sermon.youth_news) {
    try {
      newsItems = JSON.parse(sermon.youth_news)
    } catch {
      // 파싱 실패 시 텍스트로 표시
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/sermons" className="text-gray-600 hover:text-gray-900">
            ← 돌아가기
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">반원중앙교회</h1>
            <p className="text-gray-600 text-sm">청년부 설교 노트</p>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 주보 정보 */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="text-sm text-gray-500 mb-6 font-semibold">
            {sermon.date}
          </div>

          {/* 예배순서 */}
          {sermon.worship_order && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">예배순서</h2>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 font-mono text-sm">
                {sermon.worship_order}
              </div>
            </div>
          )}

          {/* 청년부 소식 */}
          {newsItems.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                청년부 소식
              </h2>
              <div className="space-y-4">
                {newsItems.map((item, index) => (
                  <div key={item.id} className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {index + 1}. {item.title}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 오늘의 말씀 */}
          {(sermon.sermon_title ||
            sermon.sermon_scripture ||
            sermon.sermon_preacher) && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                오늘의 말씀
              </h2>
              {sermon.sermon_title && (
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {sermon.sermon_title}
                </h3>
              )}
              {sermon.sermon_scripture && (
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-semibold">본문:</span>{' '}
                  {sermon.sermon_scripture}
                </p>
              )}
              {sermon.sermon_preacher && (
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">설교자:</span>{' '}
                  {sermon.sermon_preacher}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 메모 영역 */}
        <div className="bg-white rounded-lg shadow p-8">
          <NoteEditor
            sermonId={sermon.id}
            initialContent={userNote?.content || ''}
          />
        </div>
      </main>
    </div>
  )
}
