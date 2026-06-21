import type { Appointment } from '@/types';
import { customers, consultants } from './';

const now = new Date();
const daysFromNow = (days: number, hour: number, minute: number) => {
  const date = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const makeHistory = (events: { status: Appointment['status']; daysOffset: number; hour: number; minute: number; operatorName?: string; remark?: string }[]) => {
  return events.map(e => ({
    status: e.status,
    timestamp: daysFromNow(e.daysOffset, e.hour, e.minute),
    operatorName: e.operatorName,
    remark: e.remark,
  }));
};

export const appointments: Appointment[] = [
  {
    id: 'a001',
    customerId: 'cu007',
    customer: customers[6],
    consultantId: 'c003',
    consultant: consultants[2],
    project: '线雕提升',
    projectCategory: 'antiaging',
    appointmentTime: daysFromNow(0, 14, 30),
    status: 'confirmed',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -2, hour: 10, minute: 0, operatorName: '王诗涵', remark: '会话转出' },
      { status: 'confirmed', daysOffset: -2, hour: 11, minute: 30, operatorName: '前台小李' },
    ]),
    note: '客户比较在意维持时间，建议到院后重点说明',
    createdAt: daysFromNow(-2, 10, 0),
  },
  {
    id: 'a002',
    customerId: 'cu001',
    customer: customers[0],
    consultantId: 'c005',
    consultant: consultants[4],
    project: '瘦脸针',
    projectCategory: 'antiaging',
    appointmentTime: daysFromNow(0, 16, 0),
    status: 'pending',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -1, hour: 15, minute: 0, operatorName: '陈思语', remark: '会话转出' },
    ]),
    note: '首次到院，需要详细介绍',
    createdAt: daysFromNow(-1, 15, 0),
  },
  {
    id: 'a003',
    customerId: 'cu003',
    customer: customers[2],
    consultantId: 'c001',
    consultant: consultants[0],
    project: '热玛吉五代',
    projectCategory: 'antiaging',
    appointmentTime: daysFromNow(1, 10, 0),
    status: 'confirmed',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -3, hour: 11, minute: 0, operatorName: '李美琪', remark: '会话转出' },
      { status: 'confirmed', daysOffset: -3, hour: 14, minute: 20, operatorName: '前台小王' },
    ]),
    note: 'VIP客户，需提前安排好房间',
    createdAt: daysFromNow(-3, 11, 0),
  },
  {
    id: 'a004',
    customerId: 'cu005',
    customer: customers[4],
    consultantId: 'c001',
    consultant: consultants[0],
    project: '假体隆胸面诊',
    projectCategory: 'breast',
    appointmentTime: daysFromNow(5, 9, 30),
    status: 'pending',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: 0, hour: 10, minute: 0, operatorName: '李美琪', remark: '会话转出' },
    ]),
    note: '高意向客户，重点跟进',
    createdAt: daysFromNow(0, 10, 0),
  },
  {
    id: 'a005',
    customerId: 'cu002',
    customer: customers[1],
    consultantId: 'c002',
    consultant: consultants[1],
    project: '肋软骨隆鼻面诊',
    projectCategory: 'rhinoplasty',
    appointmentTime: daysFromNow(2, 14, 0),
    status: 'confirmed',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -1, hour: 9, minute: 0, operatorName: '张雅婷', remark: '会话转出' },
      { status: 'confirmed', daysOffset: -1, hour: 10, minute: 15, operatorName: '前台小李' },
    ]),
    note: '担心疼痛，需提前做好安抚',
    createdAt: daysFromNow(-1, 9, 0),
  },
  {
    id: 'a006',
    customerId: 'cu006',
    customer: customers[5],
    consultantId: 'c003',
    consultant: consultants[2],
    project: '光子嫩肤',
    projectCategory: 'skin',
    appointmentTime: daysFromNow(-1, 11, 0),
    status: 'arrived',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -5, hour: 10, minute: 0, operatorName: '王诗涵', remark: '会话转出' },
      { status: 'confirmed', daysOffset: -5, hour: 11, minute: 30, operatorName: '前台小王' },
      { status: 'arrived', daysOffset: -1, hour: 11, minute: 5, operatorName: '前台小李' },
    ]),
    note: '已到院，已完成项目',
    createdAt: daysFromNow(-5, 10, 0),
  },
  {
    id: 'a007',
    customerId: 'cu004',
    customer: customers[3],
    consultantId: 'c004',
    consultant: consultants[3],
    project: '双眼皮面诊',
    projectCategory: 'other',
    appointmentTime: daysFromNow(-1, 15, 0),
    status: 'no_show',
    statusHistory: makeHistory([
      { status: 'pending', daysOffset: -3, hour: 14, minute: 0, operatorName: '刘思琪', remark: '会话转出' },
      { status: 'confirmed', daysOffset: -3, hour: 16, minute: 0, operatorName: '前台小李' },
      { status: 'no_show', daysOffset: -1, hour: 16, minute: 0, operatorName: '前台小王', remark: '电话无人接听' },
    ]),
    note: '客户未到院，电话无人接听',
    createdAt: daysFromNow(-3, 14, 0),
  },
];

export const getTodayAppointments = (): Appointment[] => {
  const today = new Date().toDateString();
  return appointments.filter(a => new Date(a.appointmentTime).toDateString() === today);
};

export const getAppointmentsByStatus = (status: string): Appointment[] => {
  if (!status || status === 'all') return appointments;
  return appointments.filter(a => a.status === status);
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  return appointments.find(a => a.id === id);
};
