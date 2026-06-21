import { useState } from 'react';
import { ClipboardCheck, Star, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { qualityReviews, pendingQualityConversations } from '@/data/qualityReviews';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type TabKey = 'pending' | 'completed';

export function QualityReview() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const tabItems = [
    { key: 'pending', label: `待质检 (${pendingQualityConversations.length})` },
    { key: 'completed', label: `已质检 (${qualityReviews.length})` },
  ];

  const renderStars = (score: number, size = 'sm') => {
    const fullStars = Math.floor(score / 20);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
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

  const selectedReviewData = qualityReviews.find(r => r.id === selectedReview);

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
              {pendingQualityConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {}}
                  className="p-4 hover:bg-warm-gray-50 cursor-pointer transition-colors"
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
                        {dayjs(conv.startTime).format('MM-DD HH:mm')} · 约{Math.round(((new Date(conv.endTime || '').getTime() - new Date(conv.startTime).getTime()) / 60000))}分钟
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
              ))}
            </div>
          ) : (
            <div className="divide-y divide-warm-gray-100">
              {qualityReviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => setSelectedReview(review.id)}
                  className={cn(
                    'p-4 hover:bg-warm-gray-50 cursor-pointer transition-colors',
                    selectedReview === review.id && 'bg-primary-50'
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
                          {review.issueTags.map((tag, idx) => (
                            <Badge key={idx} variant="danger" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 bg-warm-gray-50 overflow-y-auto p-6">
          {selectedReviewData ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-serif text-lg font-semibold text-warm-gray-800">质检详情</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center gap-6 pb-4 border-b border-warm-gray-100">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary-600">{selectedReviewData.score}</div>
                      <p className="text-sm text-warm-gray-500 mt-1">综合评分</p>
                    </div>
                    <div className="flex-1">
                      {renderStars(selectedReviewData.score, 'lg')}
                      <p className="text-sm text-warm-gray-500 mt-2">
                        质检人：{selectedReviewData.reviewer.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-600">响应速度</span>
                        <span className="font-medium">{selectedReviewData.dimensions.responseSpeed}分</span>
                      </div>
                      <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedReviewData.dimensions.responseSpeed}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-600">专业度</span>
                        <span className="font-medium">{selectedReviewData.dimensions.professionalism}分</span>
                      </div>
                      <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedReviewData.dimensions.professionalism}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-600">服务态度</span>
                        <span className="font-medium">{selectedReviewData.dimensions.serviceAttitude}分</span>
                      </div>
                      <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedReviewData.dimensions.serviceAttitude}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-600">转化技巧</span>
                        <span className="font-medium">{selectedReviewData.dimensions.conversionSkill}分</span>
                      </div>
                      <div className="w-full h-2 bg-warm-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedReviewData.dimensions.conversionSkill}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedReviewData.issueTags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-warm-gray-100">
                      <p className="text-sm font-medium text-warm-gray-700 mb-2">问题标签</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedReviewData.issueTags.map((tag, idx) => (
                          <Badge key={idx} variant="danger" size="md">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-warm-gray-100">
                    <p className="text-sm font-medium text-warm-gray-700 mb-2">质检评语</p>
                    <p className="text-sm text-warm-gray-600 bg-warm-gray-50 p-3 rounded-lg">
                      {selectedReviewData.comment}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-serif text-lg font-semibold text-warm-gray-800">聊天记录</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-warm-gray-500 text-center py-8">
                    点击查看完整聊天记录
                  </p>
                </CardBody>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-warm-gray-400">
              <ClipboardCheck className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">选择一条质检记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
