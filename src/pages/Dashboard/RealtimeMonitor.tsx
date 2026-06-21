import { Clock, AlertTriangle, Users, PhoneCall } from 'lucide-react';
import { realtimeMonitor } from '@/data/dashboard';
import { cn } from '@/lib/utils';

const monitorItems = [
  {
    key: 'pendingLeads',
    label: '待接待线索',
    value: 8,
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    key: 'timeoutLeads',
    label: '超时限',
    value: 2,
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    pulse: true,
  },
  {
    key: 'onlineConsultants',
    label: '在线咨询师',
    value: 4,
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    key: 'busyConsultants',
    label: '接待中',
    value: 3,
    icon: PhoneCall,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
];

export function RealtimeMonitor() {
  return (
    <div className="bg-white rounded-xl border border-warm-gray-200 p-6">
      <h3 className="text-lg font-serif font-semibold text-warm-gray-800 mb-4">实时监控</h3>
      <div className="grid grid-cols-2 gap-4">
        {monitorItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={cn(
                'p-4 rounded-lg transition-all duration-200 hover:shadow-md',
                item.bgColor
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', item.bgColor, item.color)}>
                  <Icon className={cn('w-5 h-5', item.color, item.pulse && 'animate-pulse')} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warm-gray-800">{item.value}</p>
                  <p className="text-xs text-warm-gray-500">{item.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-warm-gray-100">
        <p className="text-sm text-warm-gray-600">
          <span className="text-red-500 font-medium">预警：</span>
          有 <span className="font-semibold text-red-600">2</span> 条线索等待超过10分钟未接待
        </p>
        <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
          立即查看 →
        </button>
      </div>
    </div>
  );
}
