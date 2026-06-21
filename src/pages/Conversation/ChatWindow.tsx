import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Zap, Phone, Video } from 'lucide-react';
import type { Message, Conversation } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { QuickReplies } from './QuickReplies';
import dayjs from 'dayjs';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ conversation, messages, onSendMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReplySelect = (content: string) => {
    setInputValue(content);
    setShowQuickReplies(false);
  };

  const formatTime = (time: string) => {
    return dayjs(time).format('HH:mm');
  };

  const shouldShowTime = (index: number) => {
    if (index === 0) return true;
    const current = dayjs(messages[index].timestamp);
    const prev = dayjs(messages[index - 1].timestamp);
    return current.diff(prev, 'minute') >= 5;
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-warm-gray-50">
        <div className="text-center text-warm-gray-400">
          <div className="w-16 h-16 rounded-full bg-warm-gray-100 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8" />
          </div>
          <p className="text-lg font-medium">选择一个会话开始接待</p>
          <p className="text-sm mt-1">从左侧列表选择客户进行沟通</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-14 px-4 border-b border-warm-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={conversation.customer.avatar} alt={conversation.customer.name} size="md" />
          <div>
            <h3 className="font-medium text-warm-gray-800">{conversation.customer.name}</h3>
            <p className="text-xs text-warm-gray-500">
              {conversation.status === 'active' ? '在线' : '离线'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-warm-gray-100 transition-colors">
            <Phone className="w-5 h-5 text-warm-gray-500" />
          </button>
          <button className="p-2 rounded-lg hover:bg-warm-gray-100 transition-colors">
            <Video className="w-5 h-5 text-warm-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-gray-50">
        {messages.map((msg, index) => (
          <div key={msg.id} className="animate-fade-in">
            {shouldShowTime(index) && (
              <div className="flex justify-center mb-4">
                <span className="px-2 py-0.5 text-xs text-warm-gray-400 bg-warm-gray-200 rounded">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            )}
            <div
              className={`flex gap-3 ${
                msg.senderType === 'consultant' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar
                src={
                  msg.senderType === 'consultant'
                    ? conversation.consultant.avatar
                    : conversation.customer.avatar
                }
                alt=""
                size="sm"
              />
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                  msg.senderType === 'consultant'
                    ? 'bg-primary-500 text-white rounded-tr-sm'
                    : 'bg-white text-warm-gray-700 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.quickReplyTag && (
                  <span
                    className={`text-xs mb-1 block ${
                      msg.senderType === 'consultant'
                        ? 'text-primary-100'
                        : 'text-primary-500'
                    }`}
                  >
                    【{msg.quickReplyTag}】
                  </span>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showQuickReplies && (
        <QuickReplies
          isOpen={showQuickReplies}
          onClose={() => setShowQuickReplies(false)}
          onSelect={handleQuickReplySelect}
        />
      )}

      <div className="border-t border-warm-gray-200 p-3">
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className={`p-2 rounded-lg transition-colors ${
                showQuickReplies
                  ? 'bg-primary-100 text-primary-600'
                  : 'hover:bg-warm-gray-100 text-warm-gray-500'
              }`}
            >
              <Zap className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-warm-gray-100 text-warm-gray-500 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-warm-gray-100 text-warm-gray-500 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息，Enter 发送..."
              className="w-full px-4 py-2.5 border border-warm-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              rows={2}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
