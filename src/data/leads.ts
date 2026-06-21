import type { Lead, LeadStatus, ProjectCategory, Source } from '@/types';
import { customers } from './customers';
import { consultants } from './consultants';

const now = new Date();
const minutesAgo = (mins: number) => {
  return new Date(now.getTime() - mins * 60 * 1000).toISOString();
};

export const leads: Lead[] = [
  {
    id: 'l001',
    customerId: 'cu001',
    customer: customers[0],
    source: 'meituan' as Source,
    project: '硅胶隆鼻',
    projectCategory: 'rhinoplasty' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(8),
    waitTime: 8,
    firstMessage: '您好，我想咨询一下隆鼻的项目，请问你们医院做的怎么样？',
  },
  {
    id: 'l002',
    customerId: 'cu002',
    customer: customers[1],
    source: 'xinyang' as Source,
    project: '超皮秒祛斑',
    projectCategory: 'skin' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(5),
    waitTime: 5,
    firstMessage: '你们家超皮秒多少钱？我想做雀斑。',
  },
  {
    id: 'l003',
    customerId: 'cu003',
    customer: customers[2],
    source: 'meituan' as Source,
    project: '热玛吉五代',
    projectCategory: 'antiaging' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(12),
    waitTime: 12,
    firstMessage: '热玛吉全脸现在什么价格？我之前做过，想再做一次。',
  },
  {
    id: 'l004',
    customerId: 'cu004',
    customer: customers[3],
    source: 'xinyang' as Source,
    project: '双眼皮全切',
    projectCategory: 'other' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(3),
    waitTime: 3,
    firstMessage: '请问全切双眼皮多久能恢复自然？',
  },
  {
    id: 'l005',
    customerId: 'cu005',
    customer: customers[4],
    source: 'meituan' as Source,
    project: '假体隆胸',
    projectCategory: 'breast' as ProjectCategory,
    status: 'in_conversation' as LeadStatus,
    consultantId: 'c001',
    consultant: consultants[0],
    createdAt: minutesAgo(35),
    assignedAt: minutesAgo(32),
    waitTime: 3,
  },
  {
    id: 'l006',
    customerId: 'cu006',
    customer: customers[5],
    source: 'xinyang' as Source,
    project: '肋软骨隆鼻',
    projectCategory: 'rhinoplasty' as ProjectCategory,
    status: 'in_conversation' as LeadStatus,
    consultantId: 'c002',
    consultant: consultants[1],
    createdAt: minutesAgo(45),
    assignedAt: minutesAgo(40),
    waitTime: 5,
  },
  {
    id: 'l007',
    customerId: 'cu007',
    customer: customers[6],
    source: 'meituan' as Source,
    project: '线雕提升',
    projectCategory: 'antiaging' as ProjectCategory,
    status: 'appointed' as LeadStatus,
    consultantId: 'c003',
    consultant: consultants[2],
    createdAt: minutesAgo(120),
    assignedAt: minutesAgo(115),
    waitTime: 5,
  },
  {
    id: 'l008',
    customerId: 'cu008',
    customer: customers[7],
    source: 'xinyang' as Source,
    project: '光子嫩肤',
    projectCategory: 'skin' as ProjectCategory,
    status: 'invalid' as LeadStatus,
    consultantId: 'c004',
    consultant: consultants[3],
    createdAt: minutesAgo(80),
    assignedAt: minutesAgo(75),
    waitTime: 5,
    invalidReason: '价格超出预算',
  },
  {
    id: 'l009',
    customerId: 'cu001',
    customer: customers[0],
    source: 'meituan' as Source,
    project: '瘦脸针',
    projectCategory: 'other' as ProjectCategory,
    status: 'appointed' as LeadStatus,
    consultantId: 'c005',
    consultant: consultants[4],
    createdAt: minutesAgo(200),
    assignedAt: minutesAgo(195),
    waitTime: 5,
  },
  {
    id: 'l010',
    customerId: 'cu002',
    customer: customers[1],
    source: 'xinyang' as Source,
    project: '玻尿酸填充',
    projectCategory: 'antiaging' as ProjectCategory,
    status: 'in_conversation' as LeadStatus,
    consultantId: 'c001',
    consultant: consultants[0],
    createdAt: minutesAgo(25),
    assignedAt: minutesAgo(22),
    waitTime: 3,
  },
  {
    id: 'l011',
    customerId: 'cu003',
    customer: customers[2],
    source: 'meituan' as Source,
    project: '腰腹吸脂',
    projectCategory: 'body' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(15),
    waitTime: 15,
    firstMessage: '腰腹吸脂效果怎么样？会不会反弹？',
  },
  {
    id: 'l012',
    customerId: 'cu004',
    customer: customers[3],
    source: 'xinyang' as Source,
    project: '水光针',
    projectCategory: 'skin' as ProjectCategory,
    status: 'pending' as LeadStatus,
    createdAt: minutesAgo(2),
    waitTime: 2,
    firstMessage: '基础水光针一次多少钱？需要做几次？',
  },
];

export const getPendingLeads = (): Lead[] => {
  return leads.filter(l => l.status === 'pending').sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getAssignedLeads = (): Lead[] => {
  return leads.filter(l => l.status !== 'pending');
};

export const getLeadsByConsultant = (consultantId: string): Lead[] => {
  return leads.filter(l => l.consultantId === consultantId);
};

export const getLeadById = (id: string): Lead | undefined => {
  return leads.find(l => l.id === id);
};
