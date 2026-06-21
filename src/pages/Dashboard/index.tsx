import { BarChart3, Eye } from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { FunnelChart } from './FunnelChart';
import { ConsultantRanking } from './ConsultantRanking';
import { RealtimeMonitor } from './RealtimeMonitor';
import { TrendChart } from './TrendChart';
import { Button } from '@/components/ui/Button';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-warm-gray-800">主管看板</h1>
            <p className="text-sm text-warm-gray-500">实时数据监控与团队绩效分析</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
            今日数据
          </Button>
          <select className="px-3 py-2 text-sm border border-warm-gray-300 rounded-md bg-white text-warm-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>今日</option>
            <option>昨日</option>
            <option>本周</option>
            <option>本月</option>
          </select>
        </div>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div>
          <RealtimeMonitor />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FunnelChart />
        </div>
        <div>
          <ConsultantRanking />
        </div>
      </div>
    </div>
  );
}
