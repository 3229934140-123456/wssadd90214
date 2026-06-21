import type { DashboardData, TodayStats, FunnelDataItem, ConsultantRanking, RealtimeMonitor } from '@/types';
import { consultants } from './consultants';

export const todayStats: TodayStats = {
  totalLeads: 42,
  receivedLeads: 38,
  validConsultations: 25,
  appointments: 12,
  arrivals: 8,
  conversionRate: 0.286,
  avgResponseTime: 42,
};

export const funnelData: FunnelDataItem[] = [
  { stage: '线索总量', value: 42, rate: 1 },
  { stage: '已接待', value: 38, rate: 0.905 },
  { stage: '有效咨询', value: 25, rate: 0.658 },
  { stage: '已预约', value: 12, rate: 0.48 },
  { stage: '已到院', value: 8, rate: 0.667 },
];

export const consultantRanking: ConsultantRanking[] = [
  {
    id: 'c003',
    name: '张雅婷',
    avatar: consultants[2].avatar,
    leadsCount: 19,
    conversionRate: 0.45,
    avgScore: 95,
  },
  {
    id: 'c001',
    name: '李美琪',
    avatar: consultants[0].avatar,
    leadsCount: 28,
    conversionRate: 0.42,
    avgScore: 92,
  },
  {
    id: 'c005',
    name: '刘梦瑶',
    avatar: consultants[4].avatar,
    leadsCount: 21,
    conversionRate: 0.4,
    avgScore: 88,
  },
  {
    id: 'c002',
    name: '王思涵',
    avatar: consultants[1].avatar,
    leadsCount: 23,
    conversionRate: 0.38,
    avgScore: 85,
  },
  {
    id: 'c004',
    name: '陈雨萱',
    avatar: consultants[3].avatar,
    leadsCount: 15,
    conversionRate: 0.35,
    avgScore: 82,
  },
];

export const realtimeMonitor: RealtimeMonitor = {
  pendingLeads: 8,
  timeoutLeads: 2,
  onlineConsultants: 4,
  busyConsultants: 3,
};

export const dashboardData: DashboardData = {
  todayStats,
  funnelData,
  consultantRanking,
  realtimeMonitor,
};

export const hourlyTrendData = [
  { hour: '09:00', leads: 3, appointments: 1 },
  { hour: '10:00', leads: 5, appointments: 2 },
  { hour: '11:00', leads: 7, appointments: 3 },
  { hour: '12:00', leads: 4, appointments: 1 },
  { hour: '13:00', leads: 3, appointments: 2 },
  { hour: '14:00', leads: 6, appointments: 3 },
  { hour: '15:00', leads: 8, appointments: 2 },
  { hour: '16:00', leads: 6, appointments: 1 },
];

export const weekTrendData = [
  { day: '周一', leads: 35, appointments: 10 },
  { day: '周二', leads: 42, appointments: 12 },
  { day: '周三', leads: 38, appointments: 9 },
  { day: '周四', leads: 45, appointments: 14 },
  { day: '周五', leads: 50, appointments: 15 },
  { day: '周六', leads: 60, appointments: 18 },
  { day: '周日', leads: 55, appointments: 16 },
];
