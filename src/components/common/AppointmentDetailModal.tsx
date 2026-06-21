import { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Appointment, Message, AppointmentStatus } from '@/types';
import { APPOINTMENT_STATUS_LABELS, INTENTION_LEVEL_LABELS, INTENTION_LEVEL_COLORS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ButtonVariant } from '@/components/ui/Button';
import { AlertCircle as AlertIcon } from 'lucide-react';
import dayjs from 'dayjs';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const STATUS_ACTIONS: { status: AppointmentStatus; label: string; icon: any; variant: ButtonVariant }[] = [
  { status: 'confirmed', label: '确认到院', icon: CheckCircle, variant: 'success' },
  { status: 'arrived', label: '已到院', icon: CheckCircle, variant: 'success' },
  { status: 'no_show', label: '未到院', icon: XCircle, variant: 'outline' },
  { status: 'cancelled', label: '取消', icon: XCircle, variant: 'danger' },
];

export function AppointmentDetailModal({ isOpen, onClose, appointment }: AppointmentDetailModalProps) {
  const allMessages = useAppStore((state) => state.messages);
  const updateAppointmentStatus = useAppStore((state) => state.updateAppointmentStatus);
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');

  if (!isOpen || !appointment) return null;

  const conversationMessages = appointment.conversationId
    ? (allMessages[appointment.conversationId] || [])
    : [];

  const handleStatusChange = (status: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, status);
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isCustomer = message.senderType === 'customer';
    return (
      <div className={`flex mb-3 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
        {isCustomer && (
          <Avatar
            src={appointment.customer.avatar}
            alt=""
            size="sm"
            className="mr-2 mt-0.5"
          />
        )}
        <div
          className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
            isCustomer
              ? 'bg-warm-gray-100 text-warm-gray-700 rounded-tl-none'
              : 'bg-primary-500 text-white rounded-tr-none'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-1 ${isCustomer ? 'text-warm-gray-400' : 'text-primary-200'}`}>
            {dayjs(message.timestamp).format('HH:mm')}
          </p>
        </div>
        {!isCustomer && (
          <Avatar
            src={appointment.consultant.avatar}
            alt=""
            size="sm"
            className="ml-2 mt-0.5"
          />
        )}
      </div>
    );
  };

  const StatusBadge = () => {
    const variants: Record<AppointmentStatus, any> = {
      pending: 'warning',
      confirmed: 'primary',
      arrived: 'success',
      cancelled: 'default',
      no_show: 'danger',
    };
    return (
      <Badge variant={variants[appointment.status]} size="md">
        {APPOINTMENT_STATUS_LABELS[appointment.status]}
      </Badge>
    );
  };

  const availableActions = STATUS_ACTIONS.filter(a => a.status !== appointment.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-modal w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-warm-gray-800">预约详情</h3>
              <p className="text-sm text-warm-gray-500">
                {appointment.project}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge />
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-warm-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-warm-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-warm-gray-500 hover:text-warm-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1.5" />
            预约信息
          </button>
          {appointment.conversationId && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-warm-gray-500 hover:text-warm-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-1.5" />
              会话记录
              {conversationMessages.length > 0 && (
                <Badge variant="primary" size="sm" className="ml-1">
                  {conversationMessages.length}
                </Badge>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'info' ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-warm-gray-50 rounded-lg">
                  <p className="text-xs text-warm-gray-500 mb-1">预约日期</p>
                  <p className="font-medium text-warm-gray-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    {dayjs(appointment.appointmentTime).format('YYYY-MM-DD dddd')}
                  </p>
                </div>
                <div className="p-4 bg-warm-gray-50 rounded-lg">
                  <p className="text-xs text-warm-gray-500 mb-1">预约时间</p>
                  <p className="font-medium text-warm-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    {dayjs(appointment.appointmentTime).format('HH:mm')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-warm-gray-50 rounded-lg">
                <p className="text-xs text-warm-gray-500 mb-3">客户信息</p>
                <div className="flex items-center gap-3">
                  <Avatar src={appointment.customer.avatar} alt="" size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-warm-gray-800">
                      {appointment.customer.name}
                      {appointment.customer.intentionLevel && (
                        <span
                          className={`inline-block w-2 h-2 rounded-full ml-2 ${INTENTION_LEVEL_COLORS[appointment.customer.intentionLevel]}`}
                          title={INTENTION_LEVEL_LABELS[appointment.customer.intentionLevel]}
                        />
                      )}
                    </p>
                    <p className="text-sm text-warm-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {appointment.customer.phone}
                    </p>
                    <p className="text-sm text-warm-gray-500">
                      {appointment.customer.gender === 'female' ? '女' : '男'} · {appointment.customer.age}岁
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-warm-gray-200 space-y-2">
                  {appointment.customer.intentionLevel && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className={`w-4 h-4 ${appointment.customer.intentionLevel === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                      <span className="text-warm-gray-600">
                        意向等级：
                        <span className={appointment.customer.intentionLevel === 'high' ? 'text-red-600 font-medium' : 'text-warm-gray-700'}>
                          {INTENTION_LEVEL_LABELS[appointment.customer.intentionLevel]}
                        </span>
                      </span>
                    </div>
                  )}
                  {appointment.customer.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-warm-gray-600">预算：{appointment.customer.budget}</span>
                    </div>
                  )}
                  {appointment.customer.concerns && appointment.customer.concerns.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {appointment.customer.concerns.map((c, idx) => (
                          <Badge key={idx} variant="warning" size="sm">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-warm-gray-50 rounded-lg">
                <p className="text-xs text-warm-gray-500 mb-3">咨询师</p>
                <div className="flex items-center gap-3">
                  <Avatar src={appointment.consultant.avatar} alt="" size="md" />
                  <div>
                    <p className="font-medium text-warm-gray-800">{appointment.consultant.name}</p>
                    <p className="text-sm text-warm-gray-500">
                      擅长：{appointment.consultant.skills.join('、')}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.conversationId && (
                <div className="p-4 bg-primary-50/50 rounded-lg border border-primary-100">
                  <p className="text-xs text-primary-600 mb-2 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    来源会话信息
                  </p>
                  <div className="space-y-1.5 text-sm">
                    {appointment.conversationStartTime && (
                      <p className="text-warm-gray-600">
                        <span className="text-warm-gray-400">会话时间：</span>
                        {dayjs(appointment.conversationStartTime).format('YYYY-MM-DD HH:mm')}
                      </p>
                    )}
                    {appointment.conversationProject && (
                      <p className="text-warm-gray-600">
                        <span className="text-warm-gray-400">咨询项目：</span>
                        {appointment.conversationProject}
                      </p>
                    )}
                    {appointment.conversationConsultantName && (
                      <p className="text-warm-gray-600">
                        <span className="text-warm-gray-400">接待咨询师：</span>
                        {appointment.conversationConsultantName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {appointment.note && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-600 mb-1">备注</p>
                  <p className="text-sm text-warm-gray-700">{appointment.note}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-warm-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {conversationMessages.length === 0 ? (
                  <p className="text-sm text-warm-gray-400 text-center py-8">
                    暂无聊天记录
                  </p>
                ) : (
                  conversationMessages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-warm-gray-50 border-t border-warm-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-warm-gray-500">
              创建于 {dayjs(appointment.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                关闭
              </Button>
              {availableActions.map((action) => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  onClick={() => handleStatusChange(action.status)}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
