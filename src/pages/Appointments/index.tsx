import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointments } from '@/data/appointments';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { APPOINTMENT_STATUS_LABELS } from '@/types';
import type { AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

const statusFilters: { key: AppointmentStatus | 'all'; label: string; icon: any }[] = [
  { key: 'all', label: '全部', icon: Calendar },
  { key: 'pending', label: '待确认', icon: AlertCircle },
  { key: 'confirmed', label: '已确认', icon: CheckCircle },
  { key: 'arrived', label: '已到院', icon: CheckCircle },
  { key: 'cancelled', label: '已取消', icon: XCircle },
  { key: 'no_show', label: '未到院', icon: XCircle },
];

export function Appointments() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(dayjs());

  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    return true;
  });

  const getStatusVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'arrived': return 'success';
      case 'cancelled': return 'default';
      case 'no_show': return 'danger';
      default: return 'default';
    }
  };

  const todayAppointments = appointments.filter(
    apt => dayjs(apt.appointmentTime).isSame(dayjs(), 'day')
  );

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const days: { date: dayjs.Dayjs; isCurrentMonth: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: startOfMonth.subtract(i + 1, 'day'), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: currentDate.date(i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: endOfMonth.add(i, 'day'), isCurrentMonth: false });
    }

    return days;
  };

  const getAppointmentsForDate = (date: dayjs.Dayjs) => {
    return appointments.filter(apt => dayjs(apt.appointmentTime).isSame(date, 'day'));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-warm-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-warm-gray-800">到院预约</h1>
              <p className="text-sm text-warm-gray-500">今日预约 {todayAppointments.length} 位</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-warm-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-all',
                  viewMode === 'list'
                    ? 'bg-white text-warm-gray-800 shadow-sm'
                    : 'text-warm-gray-500 hover:text-warm-gray-700'
                )}
              >
                列表
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-all',
                  viewMode === 'calendar'
                    ? 'bg-white text-warm-gray-800 shadow-sm'
                    : 'text-warm-gray-500 hover:text-warm-gray-700'
                )}
              >
                日历
              </button>
            </div>
            <Button>新建预约</Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusFilters.map(filter => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all',
                  statusFilter === filter.key
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-warm-gray-600 hover:bg-warm-gray-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredAppointments.map(apt => (
              <Card key={apt.id} hoverable>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        {dayjs(apt.appointmentTime).format('DD')}
                      </p>
                      <p className="text-xs text-warm-gray-400">
                        {dayjs(apt.appointmentTime).format('MM月')}
                      </p>
                    </div>

                    <div className="w-px h-12 bg-warm-gray-200" />

                    <Avatar src={apt.customer.avatar} alt={apt.customer.name} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-warm-gray-800">{apt.customer.name}</h3>
                        <Badge variant={getStatusVariant(apt.status) as any} size="sm">
                          {APPOINTMENT_STATUS_LABELS[apt.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-warm-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {dayjs(apt.appointmentTime).format('HH:mm')}
                        </span>
                        <span>{apt.project}</span>
                        <span>咨询师：{apt.consultant.name}</span>
                      </div>
                      {apt.note && (
                        <p className="text-xs text-warm-gray-400 mt-1 bg-warm-gray-50 px-2 py-1 rounded inline-block">
                          备注：{apt.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">取消</Button>
                          <Button size="sm">确认</Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <Button size="sm">到院确认</Button>
                      )}
                      {apt.status === 'arrived' && (
                        <span className="text-sm text-green-600 font-medium">已完成</span>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-warm-gray-800">
                  {currentDate.format('YYYY年 M月')}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
                    className="p-1.5 rounded-md hover:bg-warm-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-warm-gray-500" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(dayjs())}
                    className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    今天
                  </button>
                  <button
                    onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
                    className="p-1.5 rounded-md hover:bg-warm-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-warm-gray-500" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-warm-gray-500">
                    周{day}
                  </div>
                ))}
                {getDaysInMonth().map(({ date, isCurrentMonth }, idx) => {
                  const dayAppointments = getAppointmentsForDate(date);
                  const isToday = date.isSame(dayjs(), 'day');

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'min-h-24 p-2 border border-warm-gray-100 rounded-md transition-colors',
                        isCurrentMonth ? 'bg-white' : 'bg-warm-gray-50',
                        isToday && 'ring-2 ring-primary-500'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isCurrentMonth ? 'text-warm-gray-700' : 'text-warm-gray-300',
                            isToday && 'text-primary-600'
                          )}
                        >
                          {date.date()}
                        </span>
                        {dayAppointments.length > 0 && (
                          <Badge variant="primary" size="sm" className="text-xs">
                            {dayAppointments.length}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map(apt => (
                          <div
                            key={apt.id}
                            className="text-xs px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 truncate cursor-pointer hover:bg-primary-100"
                          >
                            {dayjs(apt.appointmentTime).format('HH:mm')} {apt.customer.name}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-warm-gray-400">+{dayAppointments.length - 2} 更多</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
