import { cn } from '@/lib/utils';
import type { Conversation } from '@/types';
import { SOURCE_LABELS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import dayjs from 'dayjs';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const formatTime = (time: string) => {
    const now = dayjs();
    const msgTime = dayjs(time);
    if (now.diff(msgTime, 'day') === 0) {
      return msgTime.format('HH:mm');
    }
    return msgTime.format('MM-DD');
  };

  return (
    <div className="w-72 bg-white border-r border-warm-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-warm-gray-100">
        <h2 className="text-lg font-serif font-semibold text-warm-gray-800">会话列表</h2>
        <p className="text-sm text-warm-gray-500 mt-0.5">
          {conversations.filter(c => c.status === 'active').length} 个进行中
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-warm-gray-400 text-sm">
            暂无会话
          </div>
        ) : (
          <div className="divide-y divide-warm-gray-100">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={cn(
                  'p-4 cursor-pointer transition-all duration-150 hover:bg-warm-gray-50',
                  selectedId === conv.id && 'bg-primary-50 border-l-2 border-l-primary-500'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar src={conv.customer.avatar} alt={conv.customer.name} size="md" />
                    {conv.status === 'active' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-warm-gray-800 truncate">
                        {conv.customer.name}
                      </span>
                      <span className="text-xs text-warm-gray-400 flex-shrink-0 ml-2">
                        {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          conv.customer.tags?.includes('高意向')
                            ? 'text-primary-600'
                            : 'text-warm-gray-500'
                        )}
                      >
                        {SOURCE_LABELS[conv.leadId?.includes('xin') ? 'xinyang' : 'meituan']}
                      </span>
                    </div>
                    <p className="text-sm text-warm-gray-500 truncate">
                      {conv.lastMessage || '暂无消息'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
