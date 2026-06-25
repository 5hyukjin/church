export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 교회 정보 */}
          <div>
            <h3 className="text-white font-bold mb-4">반원중앙교회</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">주소:</span> 경기도 안산시 상록구 본오로 126
              </p>
              <p>
                <span className="font-semibold">대표전화:</span> 031-409-0027
              </p>
              <p>
                <span className="font-semibold">예배시간:</span> 매주 일요일 오전 11:55
              </p>
            </div>
          </div>

          {/* 청년부 정보 */}
          <div>
            <h3 className="text-white font-bold mb-4">청년부</h3>
            <div className="space-y-2 text-sm">
              <p>청년부에서는 20대부터 30대까지의 청년들을 위해</p>
              <p>신앙 공동체를 형성하고 말씀 중심의 신앙생활을</p>
              <p>추구하고 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-400 text-center">
            © 2024 반원중앙교회 청년부. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
