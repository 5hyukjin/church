import Link from 'next/link'
import { getSermons, type Sermon } from '@/lib/actions/sermon-queries'

interface SermonListProps {
  isAdmin: boolean
}

export async function SermonList({ isAdmin }: SermonListProps) {
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
        <div
          key={sermon.id}
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-blue-500 flex justify-between items-start"
        >
          <Link
            href={`/sermons/${sermon.id}`}
            className="flex-1 block"
          >
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
          </Link>

          {isAdmin && (
            <Link
              href={`/admin/sermons/${sermon.id}`}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
            >
              수정
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
