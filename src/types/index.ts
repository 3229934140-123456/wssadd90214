export type Source = 'meituan' | 'xinyang';

export type LeadStatus = 'pending' | 'assigned' | 'in_conversation' | 'appointed' | 'invalid';

export type ProjectCategory = 'rhinoplasty' | 'skin' | 'antiaging' | 'breast' | 'body' | 'other';

export type AppointmentStatus = 'pending' | 'confirmed' | 'arrived' | 'cancelled' | 'no_show';

export type UserRole = 'consultant' | 'supervisor' | 'admin';

export type IntentionLevel = 'high' | 'medium' | 'low';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'female' | 'male';
  avatar: string;
  tags: string[];
  budget?: string;
  concerns?: string[];
  intentionLevel?: IntentionLevel;
  createdAt: string;
}

export interface Consultant {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  skills: string[];
  isOnline: boolean;
  todayLeadsCount: number;
  conversionRate: number;
}

export interface Lead {
  id: string;
  customerId: string;
  customer: Customer;
  source: Source;
  project: string;
  projectCategory: ProjectCategory;
  status: LeadStatus;
  consultantId?: string;
  consultant?: Consultant;
  createdAt: string;
  assignedAt?: string;
  waitTime?: number;
  invalidReason?: string;
  firstMessage?: string;
}

export type ConversationStatus = 'active' | 'ended';

export interface Conversation {
  id: string;
  leadId: string;
  customer: Customer;
  consultant: Consultant;
  status: ConversationStatus;
  startTime: string;
  endTime?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  responseTime?: number;
}

export type MessageType = 'text' | 'image' | 'quick_reply';

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'consultant';
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageType;
  quickReplyTag?: string;
}

export interface QuickReply {
  id: string;
  category: string;
  tag: string;
  content: string;
}

export interface Appointment {
  id: string;
  conversationId?: string;
  conversationStartTime?: string;
  conversationProject?: string;
  conversationConsultantName?: string;
  customerId: string;
  customer: Customer;
  consultantId: string;
  consultant: Consultant;
  project: string;
  projectCategory: ProjectCategory;
  appointmentTime: string;
  status: AppointmentStatus;
  note?: string;
  createdAt: string;
}

export interface QualityDimensions {
  responseSpeed: number;
  professionalism: number;
  serviceAttitude: number;
  conversionSkill: number;
}

export interface QualityReview {
  id: string;
  conversationId: string;
  conversation: Conversation;
  reviewerId: string;
  reviewer: Consultant;
  score: number;
  dimensions: QualityDimensions;
  issueTags: string[];
  comment: string;
  reviewedAt: string;
}

export interface TodayStats {
  totalLeads: number;
  receivedLeads: number;
  validConsultations: number;
  appointments: number;
  arrivals: number;
  conversionRate: number;
  avgResponseTime: number;
}

export interface FunnelDataItem {
  stage: string;
  value: number;
  rate: number;
}

export interface ConsultantRanking {
  id: string;
  name: string;
  avatar: string;
  leadsCount: number;
  conversionRate: number;
  avgScore: number;
}

export interface RealtimeMonitor {
  pendingLeads: number;
  timeoutLeads: number;
  onlineConsultants: number;
  busyConsultants: number;
}

export interface DashboardData {
  todayStats: TodayStats;
  funnelData: FunnelDataItem[];
  consultantRanking: ConsultantRanking[];
  realtimeMonitor: RealtimeMonitor;
}

export const SOURCE_LABELS: Record<Source, string> = {
  meituan: '美团',
  xinyang: '新氧',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  pending: '待接待',
  assigned: '已分配',
  in_conversation: '接待中',
  appointed: '已预约',
  invalid: '无效线索',
};

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  rhinoplasty: '隆鼻',
  skin: '皮肤',
  antiaging: '抗衰',
  breast: '隆胸',
  body: '塑形',
  other: '其他',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  arrived: '已到院',
  cancelled: '已取消',
  no_show: '未到院',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  consultant: '咨询师',
  supervisor: '主管',
  admin: '管理员',
};

export const INTENTION_LEVEL_LABELS: Record<IntentionLevel, string> = {
  high: '高意向',
  medium: '中意向',
  low: '低意向',
};

export const INTENTION_LEVEL_COLORS: Record<IntentionLevel, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-warm-gray-400',
};
