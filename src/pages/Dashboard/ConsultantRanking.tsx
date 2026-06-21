import { Trophy, TrendingUp, Star } from 'lucide-react';
import { consultantRanking } from '@/data/dashboard';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const rankColors = [
  'from-yellow-400 to-amber-500',
  'from-gray-300 to-gray-400',
  'from-amber-600 to-amber-700',
];

const rankIcons = ['🥇', '🥈', '🥉'];

export function ConsultantRanking() {
  return (
    <div className="bg-white rounded-xl border border-warm-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-serif font-semibold text-warm-gray-800">咨询师排名</h3>
        </div>
        <select className="text-sm text-warm-gray-500 border-none bg-transparent focus:outline-none cursor-pointer">
          <option>按转化率</option>
          <option>按接待量</option>
          <option>按满意度</option>
        </select>
      </div>

      <div className="space-y-3">
        {consultantRanking.map((consultant, index) => (
          <div
            key={consultant.id}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-warm-gray-50',
              index < 3 && 'bg-gradient-to-r from-warm-gray-50 to-transparent'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                index < 3
                  ? `bg-gradient-to-br ${rankColors[index]} text-white`
                  : 'bg-warm-gray-100 text-warm-gray-500'
              )}
            >
              {index < 3 ? rankIcons[index] : index + 1}
            </div>

            <Avatar src={consultant.avatar} alt={consultant.name} size="md" />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-warm-gray-800 truncate">{consultant.name}</p>
              <div className="flex items-center gap-3 text-xs text-warm-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {(consultant.conversionRate * 100).toFixed(1)}% 转化
                </span>
                <span>{consultant.leadsCount} 接待</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-warm-gray-800">{consultant.avgScore}</span>
              </div>
              <p className="text-xs text-warm-gray-400 mt-0.5">平均分</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
