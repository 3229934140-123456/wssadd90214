import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp, X } from 'lucide-react';
import { quickReplies, quickReplyCategories } from '@/data/quickReplies';
import { cn } from '@/lib/utils';
import type { QuickReply } from '@/types';

interface QuickRepliesProps {
  onSelect: (content: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function QuickReplies({ onSelect, onClose, isOpen }: QuickRepliesProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [expandedTags, setExpandedTags] = useState<string[]>([]);

  const filteredReplies = activeCategory === '全部'
    ? quickReplies
    : quickReplies.filter(q => q.category === activeCategory);

  const groupedReplies = filteredReplies.reduce((acc, reply) => {
    if (!acc[reply.category]) {
      acc[reply.category] = [];
    }
    acc[reply.category].push(reply);
    return acc;
  }, {} as Record<string, QuickReply[]>);

  const toggleTag = (tag: string) => {
    setExpandedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-warm-gray-50 border-t border-warm-gray-200 animate-slide-up">
      <div className="flex items-center justify-between px-4 py-2 border-b border-warm-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-warm-gray-700">快捷话术</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-warm-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-warm-gray-500" />
        </button>
      </div>

      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="flex flex-wrap gap-1 mb-3">
          {quickReplyCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md transition-all',
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-warm-gray-600 hover:bg-warm-gray-100 border border-warm-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {Object.entries(groupedReplies).map(([category, replies]) => (
            <div key={category} className="bg-white rounded-md border border-warm-gray-200">
              <button
                onClick={() => toggleTag(category)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-warm-gray-700 hover:bg-warm-gray-50"
              >
                <span>{category}</span>
                {expandedTags.includes(category) ? (
                  <ChevronUp className="w-4 h-4 text-warm-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-warm-gray-400" />
                )}
              </button>
              {(expandedTags.includes(category) || category === activeCategory) && (
                <div className="px-3 pb-2 space-y-1">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      onClick={() => onSelect(reply.content)}
                      className="p-2 text-sm text-warm-gray-600 bg-warm-gray-50 rounded cursor-pointer hover:bg-primary-50 hover:text-primary-700 transition-colors line-clamp-2"
                    >
                      <span className="text-xs text-primary-500 font-medium mr-1">
                        [{reply.tag}]
                      </span>
                      {reply.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
