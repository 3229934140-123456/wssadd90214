import type { Appointment } from '@/types';
import { customers, consultants } from './';

const now = new Date();
const daysFromNow = (days: number, hour: number, minute: number) => {
  const date = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const appointments: Appointment[] = [
  {
    id: 'a001',
    customerId: 'cu007',
    customer: customers[6],
    consultantId: 'c003',
    consultant: consultants[2],
    project: '线雕提升',
    appointmentTime: daysFromNow(0, 14, 30),
    status: 'confirmed',
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
    appointmentTime: daysFromNow(0, 16, 0),
    status: 'pending',
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
    appointmentTime: daysFromNow(1, 10, 0),
    status: 'confirmed',
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
    appointmentTime: daysFromNow(5, 9, 30),
    status: 'pending',
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
    appointmentTime: daysFromNow(2, 14, 0),
    status: 'confirmed',
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
    appointmentTime: daysFromNow(-1, 11, 0),
    status: 'arrived',
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
    appointmentTime: daysFromNow(-1, 15, 0),
    status: 'no_show',
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
