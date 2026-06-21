import { useMemo } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';

export function Header() {
  const leads = useAppStore((state) => state.leads);

  const { pendingCount, timeoutCount } = useMemo(() => {
    const pending = leads.filter((l) => l.status === 'pending');
    const timeout = pending.filter((l) => (l.waitTime || 0) > 10).length;
    return { pendingCount: pending.length, timeoutCount: timeout };
  }, [leads]);

  return (
    <header className="h-16 bg-white border-b border-warm-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            icon
            placeholder="搜索线索、客户、预约..."
            className="w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-warm-gray-500">待接待</span>
            <Badge variant="primary" size="sm">
              {pendingCount}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-warm-gray-500">超时限</span>
            <Badge variant="danger" size="sm">
              {timeoutCount}
            </Badge>
          </div>
        </div>

        <div className="w-px h-6 bg-warm-gray-200" />

        <button className="relative p-2 rounded-lg hover:bg-warm-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-warm-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-warm-gray-100 transition-colors">
          <span className="text-sm text-warm-gray-700">今日数据</span>
          <ChevronDown className="w-4 h-4 text-warm-gray-400" />
        </button>
      </div>
    </header>
  );
}
