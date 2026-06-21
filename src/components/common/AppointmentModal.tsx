import { useState } from 'react';
import { X, Calendar, Clock, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { Lead, Customer } from '@/types';
import { PROJECT_CATEGORY_LABELS } from '@/types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentTime: string, note: string) => void;
  lead?: Lead | null;
  customer?: Customer | null;
  project?: string;
  projectCategory?: string;
}

export function AppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  lead,
  customer,
  project,
  projectCategory,
}: AppointmentModalProps) {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const displayCustomer = customer || lead?.customer;
  const displayProject = project || lead?.project;
  const displayCategory = projectCategory || lead?.projectCategory;

  const handleConfirm = () => {
    const fullDateTime = `${appointmentDate}T${appointmentTime}:00`;
    onConfirm(fullDateTime, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-modal w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-200">
          <h3 className="text-lg font-serif font-semibold text-warm-gray-800">转预约到院</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-warm-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-warm-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {displayCustomer && (
            <div className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-lg">
              <img
                src={displayCustomer.avatar}
                alt={displayCustomer.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-warm-gray-800">{displayCustomer.name}</p>
                <p className="text-sm text-warm-gray-500">{displayCustomer.phone}</p>
              </div>
              {displayCategory && (
                <Badge variant="primary" className="ml-auto">
                  {PROJECT_CATEGORY_LABELS[displayCategory as keyof typeof PROJECT_CATEGORY_LABELS]}
                </Badge>
              )}
            </div>
          )}

          {displayProject && (
            <div>
              <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                意向项目
              </label>
              <div className="px-3 py-2 bg-warm-gray-50 rounded-md text-warm-gray-700">
                {displayProject}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1.5" />
              预约日期
            </label>
            <Input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1.5" />
              预约时间
            </label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full px-3 py-2 border border-warm-gray-300 rounded-md text-warm-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">
              <StickyNote className="w-4 h-4 inline mr-1.5" />
              备注
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="记录客户特殊需求、注意事项..."
              rows={3}
              className="w-full px-3 py-2 border border-warm-gray-300 rounded-md text-warm-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-warm-gray-50 border-t border-warm-gray-200">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认预约
          </Button>
        </div>
      </div>
    </div>
  );
}
