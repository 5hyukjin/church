import Link from 'next/link'
import { getSermons, type Sermon } from '@/lib/actions/sermon-queries'

export async function SermonList() {
  const sermons = await getSermons()

  if (sermons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">등록된 주보가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sermons.map((sermon) => (
        <Link
          key={sermon.id}
          href={`/sermons/${sermon.id}`}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1 font-semibold">
                {sermon.date}
              </div>
              {sermon.sermon_title && (
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {sermon.sermon_title}
                </h3>
              )}
              {sermon.sermon_scripture && (
                <p className="text-sm text-gray-600 mb-1">
                  {sermon.sermon_scripture}
                </p>
              )}
              {sermon.sermon_preacher && (
                <p className="text-sm text-gray-600">
                  설교자: {sermon.sermon_preacher}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
