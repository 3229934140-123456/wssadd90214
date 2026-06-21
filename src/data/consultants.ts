import type { Consultant, UserRole } from '@/types';

export const consultants: Consultant[] = [
  {
    id: 'c001',
    name: '李美琪',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    role: 'supervisor' as UserRole,
    skills: ['隆鼻', '抗衰', '皮肤'],
    isOnline: true,
    todayLeadsCount: 28,
    conversionRate: 0.42,
  },
  {
    id: 'c002',
    name: '王思涵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    role: 'consultant' as UserRole,
    skills: ['隆鼻', '双眼皮', '隆胸'],
    isOnline: true,
    todayLeadsCount: 23,
    conversionRate: 0.38,
  },
  {
    id: 'c003',
    name: '张雅婷',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    role: 'consultant' as UserRole,
    skills: ['皮肤', '抗衰', '塑形'],
    isOnline: true,
    todayLeadsCount: 19,
    conversionRate: 0.45,
  },
  {
    id: 'c004',
    name: '陈雨萱',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    role: 'consultant' as UserRole,
    skills: ['皮肤', '祛痘', '祛斑'],
    isOnline: false,
    todayLeadsCount: 15,
    conversionRate: 0.35,
  },
  {
    id: 'c005',
    name: '刘梦瑶',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu',
    role: 'consultant' as UserRole,
    skills: ['抗衰', '热玛吉', '线雕'],
    isOnline: true,
    todayLeadsCount: 21,
    conversionRate: 0.4,
  },
];

export const getConsultantById = (id: string): Consultant | undefined => {
  return consultants.find(c => c.id === id);
};

export const getOnlineConsultants = (): Consultant[] => {
  return consultants.filter(c => c.isOnline);
};
