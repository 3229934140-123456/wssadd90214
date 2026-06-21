import { useState } from 'react';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  Tag,
  ChevronDown,
  ChevronUp,
  Phone,
  Star,
  History,
  FileText,
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react';
import type { Customer, Lead } from '@/types';
import { PROJECT_CATEGORY_LABELS, SOURCE_LABELS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface CustomerSidebarProps {
  customer: Customer | null;
  lead?: Lead | null;
  onConvertToAppointment?: () => void;
  onUpdateCustomerInfo?: (updates: { budget?: string; concerns?: string[] }) => void;
}

export function CustomerSidebar({ customer, lead, onConvertToAppointment, onUpdateCustomerInfo }: CustomerSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'intent']);
  const [isEditing, setIsEditing] = useState(false);
  const [editBudget, setEditBudget] = useState('');
  const [editConcerns, setEditConcerns] = useState<string[]>([]);
  const [newConcern, setNewConcern] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const startEditing = () => {
    setEditBudget(customer?.budget || '');
    setEditConcerns(customer?.concerns || []);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditBudget('');
    setEditConcerns([]);
    setNewConcern('');
  };

  const saveEditing = () => {
    onUpdateCustomerInfo?.({
      budget: editBudget || undefined,
      concerns: editConcerns.length > 0 ? editConcerns : undefined,
    });
    setIsEditing(false);
  };

  const addConcern = () => {
    if (newConcern.trim() && !editConcerns.includes(newConcern.trim())) {
      setEditConcerns([...editConcerns, newConcern.trim()]);
      setNewConcern('');
    }
  };

  const removeConcern = (concern: string) => {
    setEditConcerns(editConcerns.filter((c) => c !== concern));
  };

  if (!customer) {
    return (
      <div className="w-72 bg-white border-l border-warm-gray-200 flex items-center justify-center">
        <p className="text-warm-gray-400 text-sm">选择会话查看客户信息</p>
      </div>
    );
  }

  const Section = ({
    title,
    icon: Icon,
    sectionKey,
    children,
    action,
  }: {
    title: string;
    icon: any;
    sectionKey: string;
    children: React.ReactNode;
    action?: React.ReactNode;
  }) => (
    <div className="border-b border-warm-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-warm-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-warm-gray-500" />
          <span className="text-sm font-medium text-warm-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {expandedSections.includes(sectionKey) ? (
            <ChevronUp className="w-4 h-4 text-warm-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-gray-400" />
          )}
        </div>
      </button>
      {expandedSections.includes(sectionKey) && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <div className="w-72 bg-white border-l border-warm-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-warm-gray-100 bg-gradient-to-b from-primary-50 to-white">
        <div className="flex flex-col items-center text-center">
          <Avatar src={customer.avatar} alt={customer.name} size="xl" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-warm-gray-800">
            {customer.name}
          </h3>
          <p className="text-sm text-warm-gray-500 mt-1">
            {customer.gender === 'female' ? '女' : '男'} · {customer.age}岁
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm">
              <Phone className="w-3.5 h-3.5" />
              拨打电话
            </Button>
            <Button size="sm" onClick={onConvertToAppointment}>
              <Calendar className="w-3.5 h-3.5" />
              转预约
            </Button>
          </div>
          {lead?.consultant && (
            <div className="mt-3 text-xs text-warm-gray-500">
              负责咨询师：<span className="text-warm-gray-700 font-medium">{lead.consultant.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <Section title="基本信息" icon={User} sectionKey="basic">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-warm-gray-400" />
              <span className="text-warm-gray-600">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-warm-gray-400" />
              <span className="text-warm-gray-600">
                添加于 {dayjs(customer.createdAt).format('YYYY-MM-DD')}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {customer.tags.map((tag, idx) => (
                <Badge key={idx} variant={tag === '高意向' ? 'primary' : 'default'} size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="意向信息"
          icon={Star}
          sectionKey="intent"
          action={
            !isEditing ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing();
                }}
                className="p-1 text-warm-gray-400 hover:text-primary-600 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
        >
          {lead ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-warm-gray-500 text-xs mb-1">来源平台</p>
                <Badge variant={lead.source === 'meituan' ? 'meituan' : 'xinyang'} size="sm">
                  {SOURCE_LABELS[lead.source]}
                </Badge>
              </div>
              <div>
                <p className="text-warm-gray-500 text-xs mb-1">意向项目</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="primary" size="sm">
                    {PROJECT_CATEGORY_LABELS[lead.projectCategory]}
                  </Badge>
                  <span className="text-warm-gray-700">{lead.project}</span>
                </div>
              </div>

              {isEditing ? (
                <>
                  <div>
                    <p className="text-warm-gray-500 text-xs mb-1">预算范围</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <Input
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        placeholder="如：3-5万"
                        className="flex-1 text-sm h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-warm-gray-500 text-xs mb-1">顾虑点</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {editConcerns.map((concern, idx) => (
                        <Badge key={idx} variant="warning" size="sm" className="gap-1">
                          {concern}
                          <button
                            onClick={() => removeConcern(concern)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        value={newConcern}
                        onChange={(e) => setNewConcern(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addConcern()}
                        placeholder="添加顾虑点"
                        className="flex-1 text-sm h-8"
                      />
                      <button
                        onClick={addConcern}
                        className="p-1.5 bg-primary-100 text-primary-600 rounded-md hover:bg-primary-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" onClick={saveEditing}>
                      <Check className="w-3.5 h-3.5" />
                      保存
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      取消
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {customer.budget && (
                    <div>
                      <p className="text-warm-gray-500 text-xs mb-1">预算范围</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-warm-gray-700">{customer.budget}</span>
                      </div>
                    </div>
                  )}
                  {customer.concerns && customer.concerns.length > 0 && (
                    <div>
                      <p className="text-warm-gray-500 text-xs mb-1">顾虑点</p>
                      <div className="flex flex-wrap gap-1">
                        {customer.concerns.map((concern, idx) => (
                          <Badge key={idx} variant="warning" size="sm">
                            <AlertCircle className="w-3 h-3 mr-0.5" />
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {!customer.budget && (!customer.concerns || customer.concerns.length === 0) && (
                    <p className="text-xs text-warm-gray-400">点击右上角编辑补充预算和顾虑</p>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-warm-gray-400">暂无意向信息</p>
          )}
        </Section>

        <Section title="咨询历史" icon={History} sectionKey="history">
          <div className="space-y-3">
            <div className="flex items-start gap-2 pb-3 border-b border-warm-gray-100 last:border-b-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-warm-gray-700">硅胶隆鼻咨询</p>
                <p className="text-xs text-warm-gray-400 mt-0.5">2024-03-15 · 李美琪</p>
              </div>
            </div>
            <div className="flex items-start gap-2 pb-3 border-b border-warm-gray-100 last:border-b-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-warm-gray-300 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-warm-gray-700">热玛吉咨询</p>
                <p className="text-xs text-warm-gray-400 mt-0.5">2024-02-20 · 张雅婷</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="到院记录" icon={FileText} sectionKey="visits">
          <div className="space-y-3">
            <div className="flex items-start gap-2 pb-3 border-b border-warm-gray-100 last:border-b-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-warm-gray-700">光子嫩肤</p>
                <p className="text-xs text-warm-gray-400 mt-0.5">2024-04-10 · 已完成</p>
              </div>
              <Badge variant="success" size="sm">
                ¥1,280
              </Badge>
            </div>
          </div>
        </Section>

        <Section title="标签管理" icon={Tag} sectionKey="tags">
          <div className="flex flex-wrap gap-1.5">
            {customer.tags.map((tag, idx) => (
              <Badge key={idx} variant="default" size="sm" className="cursor-pointer">
                {tag}
                <span className="ml-1 text-warm-gray-400">×</span>
              </Badge>
            ))}
            <button className="px-2 py-0.5 text-xs text-warm-gray-500 border border-dashed border-warm-gray-300 rounded-md hover:border-primary-400 hover:text-primary-500 transition-colors">
              + 添加标签
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
