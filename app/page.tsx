import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { getSermons } from '@/lib/actions/sermon-queries'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

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

export default async function HomePage() {
  const user = await getCurrentUser()

  // 로그인하지 않으면 로그인 페이지로
  if (!user) {
    redirect('/login')
  }

  // 관리자 여부 확인
  const userIsAdmin = await isAdmin(user.id)

  // 로그인했으면 최근 주보 조회
  const sermons = await getSermons()
  const latestSermon = sermons[0] // 가장 최근 주보

  // 예배순서 파싱
  let worshipItems: WorshipItem[] = []
  if (latestSermon?.worship_order) {
    try {
      worshipItems = JSON.parse(latestSermon.worship_order)
    } catch {
      // 파싱 실패
    }
  }

  // 청년부 소식 파싱
  let newsItems: NewsItem[] = []
  if (latestSermon?.youth_news) {
    try {
      newsItems = JSON.parse(latestSermon.youth_news)
    } catch {
      // 파싱 실패
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAdmin={userIsAdmin} />

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {latestSermon ? (
          <>
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <div className="text-sm text-gray-500 mb-6 font-semibold">
                {latestSermon.date}
              </div>

              {/* 예배순서 */}
              {worshipItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    예배순서
                  </h2>
                  <div className="space-y-3">
                    {worshipItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="font-semibold text-gray-700 w-8">
                          {item.order}.
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.title}
                          </p>
                          {item.content && (
                            <p className="text-gray-600 text-sm">
                              {item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
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
              {(latestSermon.sermon_title ||
                latestSermon.sermon_scripture ||
                latestSermon.sermon_preacher) && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    오늘의 말씀
                  </h2>
                  {latestSermon.sermon_title && (
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {latestSermon.sermon_title}
                    </h3>
                  )}
                  {latestSermon.sermon_scripture && (
                    <p className="text-lg text-gray-700 mb-2">
                      <span className="font-semibold">본문:</span>{' '}
                      {latestSermon.sermon_scripture}
                    </p>
                  )}
                  {latestSermon.sermon_preacher && (
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">설교자:</span>{' '}
                      {latestSermon.sermon_preacher}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href={`/sermons/${latestSermon.id}`}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  메모 작성하기 →
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/sermons"
                className="text-blue-600 hover:underline font-medium"
              >
                전체 주보 목록 보기 →
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-6">
              등록된 주보가 없습니다
            </p>
            <Link
              href="/sermons"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              주보 목록 보기
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
