import type { QualityReview } from '@/types';
import { conversations, consultants } from './';

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const qualityReviews: QualityReview[] = [
  {
    id: 'q001',
    conversationId: 'conv004',
    conversation: conversations[3],
    reviewerId: 'c001',
    reviewer: consultants[0],
    score: 92,
    dimensions: {
      responseSpeed: 95,
      professionalism: 90,
      serviceAttitude: 95,
      conversionSkill: 88,
    },
    issueTags: ['产品介绍不够详细'],
    comment: '整体接待不错，响应及时，服务态度好。建议在产品介绍上可以更详细一些，增加客户的信任感。',
    reviewedAt: daysAgo(1),
  },
  {
    id: 'q002',
    conversationId: 'conv005',
    conversation: conversations[4],
    reviewerId: 'c001',
    reviewer: consultants[0],
    score: 85,
    dimensions: {
      responseSpeed: 88,
      professionalism: 82,
      serviceAttitude: 90,
      conversionSkill: 80,
    },
    issueTags: ['未主动邀约', '专业度待提升'],
    comment: '服务态度还可以，但专业度需要提升，并且没有主动邀约客户到院，错失了转化机会。',
    reviewedAt: daysAgo(2),
  },
];

export const pendingQualityConversations = [
  conversations[5],
];

export const getQualityReviewById = (id: string): QualityReview | undefined => {
  return qualityReviews.find(q => q.id === id);
};

export const getQualityReviewsByConsultant = (consultantId: string): QualityReview[] => {
  return qualityReviews.filter(q => q.conversation.consultant.id === consultantId);
};
