import { Clock, MessageCircle, Sparkles } from 'lucide-react';
import type { Lead } from '@/types';
import { SOURCE_LABELS, PROJECT_CATEGORY_LABELS, LEAD_STATUS_LABELS } from '@/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface LeadCardProps {
  lead: Lead;
  onClaim?: (leadId: string) => void;
  onAutoAssign?: (leadId: string) => void;
  onView?: (lead: Lead) => void;
  showClaimButton?: boolean;
}

export function LeadCard({ lead, onClaim, onAutoAssign, onView, showClaimButton = false }: LeadCardProps) {
  const isTimeout = (lead.waitTime || 0) > 10;
  const sourceVariant = lead.source === 'meituan' ? 'meituan' : 'xinyang';

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClaim?.(lead.id);
  };

  const handleAutoAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAutoAssign?.(lead.id);
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins > 0 ? `${mins}分` : ''}`;
  };

  return (
    <div
      onClick={() => onView?.(lead)}
      className={cn(
        'bg-white rounded-lg border border-warm-gray-200 p-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        isTimeout && lead.status === 'pending' && 'border-red-300 animate-pulse-border'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar src={lead.customer.avatar} alt={lead.customer.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-warm-gray-800 truncate">
              {lead.customer.name}
            </span>
            <Badge variant={sourceVariant} size="sm">
              {SOURCE_LABELS[lead.source]}
            </Badge>
            {isTimeout && lead.status === 'pending' && (
              <Badge variant="danger" size="sm">
                超时
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-warm-gray-500 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {lead.status === 'pending'
                ? `等待 ${formatWaitTime(lead.waitTime || 0)}`
                : dayjs(lead.createdAt).format('HH:mm')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="primary" size="sm">
              {PROJECT_CATEGORY_LABELS[lead.projectCategory]}
            </Badge>
            {lead.customer.tags.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
          {lead.firstMessage && (
            <p className="text-sm text-warm-gray-600 line-clamp-2 bg-warm-gray-50 rounded px-2 py-1.5">
              {lead.firstMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-gray-100">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              lead.status === 'pending'
                ? 'warning'
                : lead.status === 'appointed'
                ? 'success'
                : lead.status === 'invalid'
                ? 'danger'
                : 'primary'
            }
            size="sm"
          >
            {LEAD_STATUS_LABELS[lead.status]}
          </Badge>
          {lead.consultant && (
            <span className="text-xs text-warm-gray-500">
              {lead.consultant.name}
            </span>
          )}
        </div>
        {showClaimButton && lead.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAutoAssign}>
              <Sparkles className="w-4 h-4" />
              智能分配
            </Button>
            <Button size="sm" onClick={handleClaim}>
              <MessageCircle className="w-4 h-4" />
              立即接待
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm">
            查看详情
          </Button>
        )}
      </div>
    </div>
  );
}
