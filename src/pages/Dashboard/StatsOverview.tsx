import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { todayStats } from '@/data/dashboard';

const statCards = [
  {
    key: 'totalLeads',
    label: '今日线索',
    value: 42,
    unit: '条',
    trend: 12,
    trendUp: true,
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    key: 'receivedLeads',
    label: '已接待',
    value: 38,
    unit: '条',
    trend: 8,
    trendUp: true,
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    key: 'appointments',
    label: '预约数',
    value: 12,
    unit: '个',
    trend: 3,
    trendUp: true,
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    key: 'conversionRate',
    label: '转化率',
    value: 28.6,
    unit: '%',
    trend: 2.3,
    trendUp: true,
    gradient: 'from-amber-500 to-amber-700',
  },
  {
    key: 'avgResponseTime',
    label: '平均响应',
    value: 42,
    unit: '秒',
    trend: 5,
    trendUp: false,
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    key: 'arrivals',
    label: '到院数',
    value: 8,
    unit: '人',
    trend: 1,
    trendUp: true,
    gradient: 'from-pink-500 to-pink-700',
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <div
          key={card.key}
          className="relative overflow-hidden bg-white rounded-xl border border-warm-gray-200 p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
              card.gradient
            )}
          />
          <p className="text-sm text-warm-gray-500 mb-2">{card.label}</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-serif font-bold text-warm-gray-800">
              {card.value}
            </span>
            <span className="text-sm text-warm-gray-400">{card.unit}</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              card.trendUp ? 'text-green-500' : 'text-red-500'
            )}
          >
            {card.trendUp ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {card.trendUp ? '+' : ''}
              {card.trend}
              {card.unit === '%' ? 'pp' : card.unit}
            </span>
            <span className="text-warm-gray-400 ml-1">较昨日</span>
          </div>
        </div>
      ))}
    </div>
  );
}
