import { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, MessageCircle, User, Phone, Star, DollarSign, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AppointmentDetailModal } from '@/components/common/AppointmentDetailModal';
import { APPOINTMENT_STATUS_LABELS, INTENTION_LEVEL_LABELS, INTENTION_LEVEL_COLORS } from '@/types';
import type { AppointmentStatus, Appointment } from '@/types';
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
  const appointments = useAppStore((state) => state.appointments);
  const updateAppointmentStatus = useAppStore((state) => state.updateAppointmentStatus);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [highIntentionOnly, setHighIntentionOnly] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (highIntentionOnly && apt.customer.intentionLevel !== 'high') return false;
      return true;
    });
  }, [appointments, statusFilter, highIntentionOnly]);

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

  const todayAppointments = useMemo(() => {
    return appointments.filter(
      apt => dayjs(apt.appointmentTime).isSame(dayjs(), 'day')
    );
  }, [appointments]);

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
    return filteredAppointments.filter(apt => dayjs(apt.appointmentTime).isSame(date, 'day'));
  };

  const getStatusBorderClass = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending': return 'border-l-4 border-l-amber-500 bg-amber-50/50';
      case 'confirmed': return 'border-l-4 border-l-primary-500 bg-primary-50/50';
      case 'arrived': return 'border-l-4 border-l-green-500 bg-green-50/50';
      case 'cancelled': return 'border-l-4 border-l-warm-gray-400 bg-warm-gray-50';
      case 'no_show': return 'border-l-4 border-l-red-500 bg-red-50/50';
      default: return '';
    }
  };

  const openDetail = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowDetailModal(true);
  };

  const handleQuickStatusChange = (e: React.MouseEvent, aptId: string, status: AppointmentStatus) => {
    e.stopPropagation();
    updateAppointmentStatus(aptId, status);
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
            <Button
              variant={highIntentionOnly ? 'primary' : 'outline'}
              onClick={() => setHighIntentionOnly(!highIntentionOnly)}
            >
              <Star className={cn('w-4 h-4', highIntentionOnly && 'fill-white')} />
              高意向
            </Button>
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
            const count = filter.key === 'all'
              ? appointments.length
              : appointments.filter(a => a.status === filter.key).length;
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
                <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-12 text-warm-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">暂无{statusFilter !== 'all' ? APPOINTMENT_STATUS_LABELS[statusFilter as AppointmentStatus] : ''}预约记录</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredAppointments.map(apt => (
                <Card key={apt.id} hoverable onClick={() => openDetail(apt)}>
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
                          <h3 className="font-medium text-warm-gray-800">
                            {apt.customer.name}
                            {apt.customer.intentionLevel && (
                              <span
                                className={`inline-block w-2 h-2 rounded-full ml-1.5 ${INTENTION_LEVEL_COLORS[apt.customer.intentionLevel]}`}
                                title={INTENTION_LEVEL_LABELS[apt.customer.intentionLevel]}
                              />
                            )}
                          </h3>
                          <Badge variant={getStatusVariant(apt.status) as any} size="sm">
                            {APPOINTMENT_STATUS_LABELS[apt.status]}
                          </Badge>
                          {apt.customer.intentionLevel && apt.customer.intentionLevel === 'high' && (
                            <Badge variant="danger" size="sm">高意向</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-warm-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {dayjs(apt.appointmentTime).format('HH:mm')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {apt.project}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            咨询师：{apt.consultant.name}
                          </span>
                          {apt.conversationId && apt.conversationStartTime && (
                            <span className="flex items-center gap-1 text-primary-600 font-medium">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {dayjs(apt.conversationStartTime).format('MM-DD HH:mm')} 咨询
                              {apt.conversationProject && ` · ${apt.conversationProject}`}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {apt.customer.budget && (
                            <span className="text-xs text-green-600 flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3" />
                              {apt.customer.budget}
                            </span>
                          )}
                          {apt.customer.concerns && apt.customer.concerns.length > 0 && (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <div className="flex flex-wrap gap-1">
                                {apt.customer.concerns.slice(0, 2).map((c, idx) => (
                                  <span key={idx} className="text-xs text-amber-600">{c}</span>
                                ))}
                                {apt.customer.concerns.length > 2 && (
                                  <span className="text-xs text-warm-gray-400">+{apt.customer.concerns.length - 2}</span>
                                )}
                              </div>
                            </span>
                          )}
                        </div>
                        {apt.note && (
                          <p className="text-xs text-warm-gray-400 mt-1 bg-warm-gray-50 px-2 py-1 rounded inline-block">
                            备注：{apt.note}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {apt.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" onClick={(e) => handleQuickStatusChange(e, apt.id, 'cancelled')}>
                              取消
                            </Button>
                            <Button size="sm" onClick={(e) => handleQuickStatusChange(e, apt.id, 'confirmed')}>
                              确认
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button size="sm" onClick={(e) => handleQuickStatusChange(e, apt.id, 'arrived')}>
                            到院确认
                          </Button>
                        )}
                        {apt.status === 'arrived' && (
                          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            已完成
                          </span>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => openDetail(apt)}>
                          详情
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
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
                            onClick={(e) => { e.stopPropagation(); openDetail(apt); }}
                            className={cn(
                              'text-xs px-1.5 py-1 rounded truncate cursor-pointer transition-colors font-medium',
                              getStatusBorderClass(apt.status),
                              apt.status === 'pending' && 'text-amber-700',
                              apt.status === 'confirmed' && 'text-primary-700',
                              apt.status === 'arrived' && 'text-green-700',
                              apt.status === 'cancelled' && 'text-warm-gray-500',
                              apt.status === 'no_show' && 'text-red-700',
                            )}
                            title={`${apt.customer.name} - ${apt.project} - ${APPOINTMENT_STATUS_LABELS[apt.status]}`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[10px] opacity-70">{dayjs(apt.appointmentTime).format('HH:mm')}</span>
                              <span className="truncate">{apt.customer.name}</span>
                              {apt.customer.intentionLevel === 'high' && (
                                <span className="text-red-500 text-xs flex-shrink-0" title="高意向">★</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div
                            onClick={(e) => { e.stopPropagation(); openDetail(dayAppointments[2]); }}
                            className="text-xs text-warm-gray-400 cursor-pointer hover:text-warm-gray-600 pl-1"
                          >
                            +{dayAppointments.length - 2} 更多
                          </div>
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

      <AppointmentDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </div>
  );
}
