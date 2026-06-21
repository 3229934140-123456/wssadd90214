import { NavLink, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Inbox,
  MessageCircle,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

const menuItems = [
  {
    key: 'leads',
    label: '线索池',
    icon: Inbox,
    path: '/',
  },
  {
    key: 'conversation',
    label: '会话接待',
    icon: MessageCircle,
    path: '/conversation',
  },
  {
    key: 'customers',
    label: '客户档案',
    icon: Users,
    path: '/customers',
  },
  {
    key: 'appointments',
    label: '到院预约',
    icon: Calendar,
    path: '/appointments',
  },
  {
    key: 'quality',
    label: '质检复盘',
    icon: ClipboardCheck,
    path: '/quality',
  },
  {
    key: 'dashboard',
    label: '主管看板',
    icon: BarChart3,
    path: '/dashboard',
  },
];

export function Sidebar() {
  const location = useLocation();
  const currentUser = useAppStore((state) => state.currentUser);
  const leads = useAppStore((state) => state.leads);

  const pendingLeads = useMemo(() => {
    return leads
      .filter((l) => l.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/leads');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-60 h-screen bg-white border-r border-warm-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-warm-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">美</span>
          </div>
          <span className="font-serif text-lg font-semibold text-warm-gray-800">
            医美接待台
          </span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-warm-gray-600 hover:bg-warm-gray-50 hover:text-warm-gray-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.key === 'leads' && pendingLeads.length > 0 && (
                  <Badge variant="danger" size="sm" className="ml-auto">
                    {pendingLeads.length}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="px-3 mb-2 text-xs font-medium text-warm-gray-400 uppercase tracking-wider">
            设置
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-gray-600 hover:bg-warm-gray-50 hover:text-warm-gray-900 transition-all duration-150">
            <Settings className="w-5 h-5" />
            <span>系统设置</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-warm-gray-100">
        <div className="flex items-center gap-3">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            size="md"
            status={currentUser?.isOnline ? 'online' : 'offline'}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-warm-gray-800 truncate">
              {currentUser?.name}
            </p>
            <p className="text-xs text-warm-gray-500 truncate">
              {currentUser?.role === 'supervisor'
                ? '咨询主管'
                : currentUser?.role === 'admin'
                ? '管理员'
                : '咨询师'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
