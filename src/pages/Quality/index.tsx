import { useState, useMemo } from 'react';
import { ClipboardCheck, Star, AlertTriangle, CheckCircle, Clock, ChevronRight, Send, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import type { Conversation, QualityDimensions, Message } from '@/types';

type TabKey = 'pending' | 'completed';
type ViewMode = 'list' | 'review';

const ISSUE_TAGS = ['响应不及时', '专业知识不足', '服务态度差', '转化技巧欠缺', '未记录需求', '其他'];

const DIMENSION_LABELS: Record<keyof QualityDimensions, string> = {
  responseSpeed: '响应速度',
  professionalism: '专业度',
  serviceAttitude: '服务态度',
  conversionSkill: '转化技巧',
};

const DIMENSION_COLORS: Record<keyof QualityDimensions, string> = {
  responseSpeed: 'bg-blue-500',
  professionalism: 'bg-emerald-500',
  serviceAttitude: 'bg-amber-500',
  conversionSkill: 'bg-purple-500',
};

export function QualityReview() {
  const conversations = useAppStore((state) => state.conversations);
  const allMessages = useAppStore((state) => state.messages);
  const qualityReviews = useAppStore((state) => state.qualityReviews);
  const currentUser = useAppStore((state) => state.currentUser);
  const addQualityReview = useAppStore((state) => state.addQualityReview);

  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [scores, setScores] = useState<QualityDimensions>({
    responseSpeed: 80,
    professionalism: 85,
    serviceAttitude: 90,
    conversionSkill: 75,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const pendingConversations = useMemo(() => {
    const reviewedIds = new Set(qualityReviews.map((r) => r.conversationId));
    return conversations.filter(
      (c) => c.status === 'ended' && !reviewedIds.has(c.id)
    );
  }, [conversations, qualityReviews]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const selectedReview = qualityReviews.find((r) => r.conversationId === selectedConversationId);
  const chatMessages = selectedConversationId ? allMessages[selectedConversationId] || [] : [];

  const handleStartReview = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    setViewMode('review');
    setScores({
      responseSpeed: 80,
      professionalism: 85,
      serviceAttitude: 90,
      conversionSkill: 75,
    });
    setSelectedTags([]);
    setComment('');
  };

  const handleViewReview = (reviewId: string) => {
    const review = qualityReviews.find((r) => r.id === reviewId);
    if (review) {
      setSelectedConversationId(review.conversationId);
      setViewMode('list');
    }
  };

  const handleSubmitReview = () => {
    if (!selectedConversation || !currentUser) return;

    const avgScore = Math.round(
      (scores.responseSpeed + scores.professionalism + scores.serviceAttitude + scores.conversionSkill) / 4
    );

    addQualityReview({
      conversationId: selectedConversation.id,
      conversation: selectedConversation,
      reviewerId: currentUser.id,
      reviewer: currentUser,
      score: avgScore,
      dimensions: scores,
      issueTags: selectedTags,
      comment,
      reviewedAt: new Date().toISOString(),
    });

    setActiveTab('completed');
    setViewMode('list');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const renderStars = (score: number, size = 'sm') => {
    const fullStars = Math.floor(score / 20);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
              i <= fullStars ? 'text-amber-400 fill-amber-400' : 'text-warm-gray-200'
            )}
          />
        ))}
      </div>
    );
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isCustomer = message.senderType === 'customer';
    return (
      <div className={cn('flex mb-3', isCustomer ? 'justify-start' : 'justify-end')}>
        {isCustomer && (
          <Avatar
            src={selectedConversation?.customer.avatar}
            alt=""
            size="sm"
            className="mr-2 mt-0.5"
          />
        )}
        <div
          className={cn(
            'max-w-[70%] px-4 py-2.5 rounded-2xl',
            isCustomer
              ? 'bg-warm-gray-100 text-warm-gray-700 rounded-tl-none'
              : 'bg-primary-500 text-white rounded-tr-none'
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={cn(
            'text-xs mt-1',
            isCustomer ? 'text-warm-gray-400' : 'text-primary-200'
          )}>
            {dayjs(message.timestamp).format('HH:mm')}
          </p>
        </div>
        {!isCustomer && (
          <Avatar
            src={selectedConversation?.consultant.avatar}
            alt=""
            size="sm"
            className="ml-2 mt-0.5"
          />
        )}
      </div>
    );
  };

  const tabItems = [
    { key: 'pending', label: `待质检 (${pendingConversations.length})` },
    { key: 'completed', label: `已质检 (${qualityReviews.length})` },
  ];

  const avgScore = selectedReview
    ? Math.round(
        (selectedReview.dimensions.responseSpeed +
          selectedReview.dimensions.professionalism +
          selectedReview.dimensions.serviceAttitude +
          selectedReview.dimensions.conversionSkill) /
          4
      )
    : Math.round(
        (scores.responseSpeed + scores.professionalism + scores.serviceAttitude + scores.conversionSkill) / 4
      );

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-warm-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-warm-gray-800">质检复盘</h1>
              <p className="text-sm text-warm-gray-500">抽查聊天记录，评估接待质量</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-warm-gray-500">平均评分</span>
              <span className="font-semibold text-primary-600">88.5 分</span>
            </div>
            <div className="w-px h-4 bg-warm-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-warm-gray-500">质检覆盖率</span>
              <span className="font-semibold text-green-600">75%</span>
            </div>
            <Button variant="outline" size="sm">
              批量抽检
            </Button>
          </div>
        </div>

        <Tabs tabs={tabItems as any} defaultTab="pending" onChange={(k) => setActiveTab(k as TabKey)} />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r border-warm-gray-200 overflow-y-auto bg-white">
          {activeTab === 'pending' ? (
            <div className="divide-y divide-warm-gray-100">
              {pendingConversations.length === 0 ? (
                <div className="p-8 text-center text-warm-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无待质检会话</p>
                </div>
              ) : (
                pendingConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleStartReview(conv)}
                    className={cn(
                      'p-4 hover:bg-warm-gray-50 cursor-pointer transition-colors',
                      selectedConversationId === conv.id && viewMode === 'review' && 'bg-primary-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar src={conv.customer.avatar} alt={conv.customer.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-warm-gray-800">
                            {conv.customer.name}
                          </span>
                          <Badge variant="warning" size="sm">
                            待质检
                          </Badge>
                        </div>
                        <p className="text-sm text-warm-gray-500">
                          咨询师：{conv.consultant.name}
                        </p>
                        <p className="text-xs text-warm-gray-400 mt-1">
                          {dayjs(conv.startTime).format('MM-DD HH:mm')}
                        </p>
                        <div className="mt-2">
                          <Button size="sm" variant="primary">
                            开始质检
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="divide-y divide-warm-gray-100">
              {qualityReviews.length === 0 ? (
                <div className="p-8 text-center text-warm-gray-400">
                  <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无已质检记录</p>
                </div>
              ) : (
                qualityReviews.map((review) => (
                  <div
                    key={review.id}
                    onClick={() => handleViewReview(review.id)}
                    className={cn(
                      'p-4 hover:bg-warm-gray-50 cursor-pointer transition-colors',
                      selectedConversationId === review.conversationId && viewMode === 'list' && 'bg-primary-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar src={review.conversation.customer.avatar} alt="" size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-warm-gray-800">
                            {review.conversation.customer.name}
                          </span>
                          <span className="text-lg font-bold text-primary-600">
                            {review.score}
                          </span>
                        </div>
                        {renderStars(review.score)}
                        <p className="text-sm text-warm-gray-500 mt-1">
                          {review.conversation.consultant.name}
                        </p>
                        <p className="text-xs text-warm-gray-400 mt-1">
                          {dayjs(review.reviewedAt).format('YYYY-MM-DD')}
                        </p>
                        {review.issueTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {review.issueTags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="danger" size="sm">
                                {tag}
                              </Badge>
                            ))}
                            {review.issueTags.length > 2 && (
                              <span className="text-xs text-warm-gray-400">
                                +{review.issueTags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1 bg-warm-gray-50 overflow-y-auto p-6">
          {selectedConversation ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedConversation.customer.avatar} alt="" size="md" />
                  <div>
                    <h3 className="font-medium text-warm-gray-800">
                      {selectedConversation.customer.name}
                    </h3>
                    <p className="text-sm text-warm-gray-500">
                      咨询师：{selectedConversation.consultant.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">
                    {dayjs(selectedConversation.startTime).format('YYYY-MM-DD')}
                  </Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="font-serif text-lg font-semibold text-warm-gray-800">
                    聊天记录
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="bg-warm-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {chatMessages.length === 0 ? (
                      <p className="text-sm text-warm-gray-400 text-center py-8">
                        暂无聊天记录
                      </p>
                    ) : (
                      chatMessages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              {activeTab === 'pending' && viewMode === 'review' ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-semibold text-warm-gray-800">
                        质量评分
                      </h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">{avgScore}</div>
                        <p className="text-xs text-warm-gray-500">综合分</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 gap-6">
                      {(Object.keys(scores) as (keyof QualityDimensions)[]).map((key) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-warm-gray-700">
                              {DIMENSION_LABELS[key]}
                            </span>
                            <span className="text-sm font-semibold text-warm-gray-800">
                              {scores[key]}分
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={scores[key]}
                            onChange={(e) =>
                              setScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                            }
                            className="w-full h-2 bg-warm-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                          />
                          <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all duration-300', DIMENSION_COLORS[key])}
                              style={{ width: `${scores[key]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-warm-gray-100">
                      <p className="text-sm font-medium text-warm-gray-700 mb-3">
                        <AlertTriangle className="w-4 h-4 inline mr-1.5 text-amber-500" />
                        问题标签
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ISSUE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-md transition-all border',
                              selectedTags.includes(tag)
                                ? 'bg-red-50 text-red-600 border-red-300'
                                : 'bg-white text-warm-gray-600 border-warm-gray-300 hover:border-warm-gray-400'
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-medium text-warm-gray-700 mb-2">质检评语</p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="请输入质检评语，指出问题并给出改进建议..."
                        rows={4}
                        className="w-full px-3 py-2 border border-warm-gray-300 rounded-md text-warm-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setViewMode('list')}>
                        取消
                      </Button>
                      <Button onClick={handleSubmitReview}>
                        <Send className="w-4 h-4" />
                        提交质检
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ) : selectedReview ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-semibold text-warm-gray-800">
                        质检结果
                      </h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                          {selectedReview.score}
                        </div>
                        <p className="text-xs text-warm-gray-500">综合分</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex items-center gap-6 pb-4 border-b border-warm-gray-100">
                      <div className="flex-1">
                        {renderStars(selectedReview.score, 'lg')}
                        <p className="text-sm text-warm-gray-500 mt-2">
                          质检人：{selectedReview.reviewer.name}
                        </p>
                        <p className="text-sm text-warm-gray-500">
                          质检时间：{dayjs(selectedReview.reviewedAt).format('YYYY-MM-DD HH:mm')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {(Object.keys(selectedReview.dimensions) as (keyof QualityDimensions)[]).map(
                        (key) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-warm-gray-600">
                                {DIMENSION_LABELS[key]}
                              </span>
                              <span className="font-medium">
                                {selectedReview.dimensions[key]}分
                              </span>
                            </div>
                            <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', DIMENSION_COLORS[key])}
                                style={{ width: `${selectedReview.dimensions[key]}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {selectedReview.issueTags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-warm-gray-100">
                        <p className="text-sm font-medium text-warm-gray-700 mb-2">
                          问题标签
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedReview.issueTags.map((tag, idx) => (
                            <Badge key={idx} variant="danger" size="md">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-warm-gray-100">
                      <p className="text-sm font-medium text-warm-gray-700 mb-2">
                        质检评语
                      </p>
                      <p className="text-sm text-warm-gray-600 bg-warm-gray-50 p-3 rounded-lg">
                        {selectedReview.comment}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-warm-gray-400">
              <ClipboardCheck className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">
                {activeTab === 'pending' ? '点击开始质检查看详情' : '选择一条质检记录查看详情'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
