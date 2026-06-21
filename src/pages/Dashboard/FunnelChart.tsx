import { funnelData } from '@/data/dashboard';

export function FunnelChart() {
  const maxValue = funnelData[0].value;

  return (
    <div className="bg-white rounded-xl border border-warm-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif font-semibold text-warm-gray-800">转化漏斗</h3>
          <p className="text-sm text-warm-gray-500 mt-1">线索→接待→有效咨询→预约→到院</p>
        </div>
        <div className="text-sm text-warm-gray-500">
          整体转化率 <span className="text-primary-600 font-semibold">19%</span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-1">
        {funnelData.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;
          const isLast = index === funnelData.length - 1;
          const gradientClass = [
            'from-primary-400 to-primary-600',
            'from-primary-500 to-primary-700',
            'from-primary-600 to-primary-800',
            'from-emerald-500 to-emerald-700',
            'from-emerald-600 to-emerald-800',
          ][index];

          return (
            <div key={item.stage} className="w-full flex flex-col items-center">
              <div
                className={`relative h-14 bg-gradient-to-r ${gradientClass} rounded-lg flex items-center justify-between px-6 transition-all duration-300 hover:shadow-lg cursor-pointer`}
                style={{ width: `${widthPercent}%` }}
              >
                <span className="text-white font-medium text-sm">{item.stage}</span>
                <div className="text-right">
                  <span className="text-white font-bold text-lg">{item.value}</span>
                  <span className="text-white/80 text-sm ml-1">人</span>
                </div>
              </div>
              {!isLast && (
                <div className="flex items-center gap-4 py-2">
                  <div className="w-px h-4 bg-warm-gray-200" />
                  <span className="text-xs text-warm-gray-500">
                    转化率 {(item.rate * 100).toFixed(1)}%
                  </span>
                  <div className="w-px h-4 bg-warm-gray-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
