import type { Conversation } from '@/types';
import { customers, consultants } from './';

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();

export const conversations: Conversation[] = [
  {
    id: 'conv001',
    leadId: 'l005',
    customer: customers[4],
    consultant: consultants[0],
    status: 'active',
    startTime: minutesAgo(30),
    lastMessage: '好的，我先帮您预约下周六上午的面诊，您看可以吗？',
    lastMessageTime: minutesAgo(2),
    unreadCount: 1,
    responseTime: 45,
  },
  {
    id: 'conv002',
    leadId: 'l006',
    customer: customers[5],
    consultant: consultants[1],
    status: 'active',
    startTime: minutesAgo(40),
    lastMessage: '肋软骨隆鼻的恢复期大概是多久呀？',
    lastMessageTime: minutesAgo(5),
    unreadCount: 2,
    responseTime: 38,
  },
  {
    id: 'conv003',
    leadId: 'l010',
    customer: customers[1],
    consultant: consultants[0],
    status: 'active',
    startTime: minutesAgo(20),
    lastMessage: '好的，我给您介绍一下玻尿酸的品牌区别',
    lastMessageTime: minutesAgo(8),
    unreadCount: 0,
    responseTime: 52,
  },
  {
    id: 'conv004',
    leadId: 'l007',
    customer: customers[6],
    consultant: consultants[2],
    status: 'ended',
    startTime: minutesAgo(120),
    endTime: minutesAgo(60),
    lastMessage: '好的，期待您到院！',
    lastMessageTime: minutesAgo(60),
    unreadCount: 0,
    responseTime: 28,
  },
  {
    id: 'conv005',
    leadId: 'l009',
    customer: customers[0],
    consultant: consultants[4],
    status: 'ended',
    startTime: minutesAgo(180),
    endTime: minutesAgo(150),
    lastMessage: '预约成功，明天见~',
    lastMessageTime: minutesAgo(150),
    unreadCount: 0,
    responseTime: 35,
  },
  {
    id: 'conv006',
    leadId: 'l008',
    customer: customers[7],
    consultant: consultants[3],
    status: 'ended',
    startTime: minutesAgo(70),
    endTime: minutesAgo(45),
    lastMessage: '好的，有需要再联系',
    lastMessageTime: minutesAgo(45),
    unreadCount: 0,
    responseTime: 42,
  },
];

export const getActiveConversations = (): Conversation[] => {
  return conversations.filter(c => c.status === 'active').sort((a, b) =>
    new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
  );
};

export const getConversationById = (id: string): Conversation | undefined => {
  return conversations.find(c => c.id === id);
};

export const getConversationsByConsultant = (consultantId: string): Conversation[] => {
  return conversations.filter(c => c.consultant.id === consultantId);
};
