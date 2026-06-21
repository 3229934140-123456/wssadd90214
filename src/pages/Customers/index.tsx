import { useState, useMemo } from 'react';
import { Users, Search, Filter, Phone, Calendar, Tag, DollarSign, AlertCircle, Star, X, Clock, MessageCircle, ChevronRight, History } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { APPOINTMENT_STATUS_LABELS, INTENTION_LEVEL_LABELS, INTENTION_LEVEL_COLORS } from '@/types';
import type { IntentionLevel, Appointment, AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

export function Customers() {
  const leads = useAppStore((state) => state.leads);
  const conversations = useAppStore((state) => state.conversations);
  const appointments = useAppStore((state) => state.appointments);

  const customers = useMemo(() => {
    const seen = new Map<string, { id: string; name: string; phone: string; age: number; gender: 'female' | 'male'; avatar: string; tags: string[]; budget?: string; concerns?: string[]; intentionLevel?: IntentionLevel; createdAt: string }>();
    for (const l of leads) {
      if (!seen.has(l.customerId)) {
        seen.set(l.customerId, l.customer);
      } else {
        const existing = seen.get(l.customerId)!;
        const updated = { ...existing, ...l.customer };
        seen.set(l.customerId, updated);
      }
    }
    for (const c of conversations) {
      if (!seen.has(c.customer.id)) {
        seen.set(c.customer.id, c.customer);
      } else {
        const existing = seen.get(c.customer.id)!;
        const updated = { ...existing, ...c.customer };
        seen.set(c.customer.id, updated);
      }
    }
    return Array.from(seen.values());
  }, [leads, conversations]);

  const getCustomerAppointments = (customerId: string) => {
    return appointments.filter(a => a.customerId === customerId).sort((a, b) =>
      dayjs(b.appointmentTime).valueOf() - dayjs(a.appointmentTime).valueOf()
    );
  };

  const getLatestAppointment = (customerId: string) => {
    const apts = getCustomerAppointments(customerId);
    return apts.length > 0 ? apts[0] : null;
  };

  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<IntentionLevel | null>(null);
  const [showHighIntentionOnly, setShowHighIntentionOnly] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  const filteredCustomers = customers.filter(customer => {
    if (searchText && !customer.name.includes(searchText) && !customer.phone.includes(searchText)) {
      return false;
    }
    if (selectedTag && !customer.tags.includes(selectedTag)) {
      return false;
    }
    if (selectedIntention && customer.intentionLevel !== selectedIntention) {
      return false;
    }
    if (showHighIntentionOnly && customer.intentionLevel !== 'high') {
      return false;
    }
    return true;
  });

  const openDetail = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowDetailModal(true);
  };

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

  const currentCustomer = selectedCustomer ? customers.find(c => c.id === selectedCustomer) || null : null;
  const customerAppointments = selectedCustomer ? getCustomerAppointments(selectedCustomer) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-warm-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-warm-gray-800">客户档案</h1>
              <p className="text-sm text-warm-gray-500">共 {customers.length} 位客户</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showHighIntentionOnly ? 'primary' : 'outline'}
              onClick={() => setShowHighIntentionOnly(!showHighIntentionOnly)}
            >
              <Star className={cn('w-4 h-4', showHighIntentionOnly && 'fill-white')} />
              高意向客户
            </Button>
            <Button>
              <Filter className="w-4 h-4" />
              高级筛选
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-64">
            <Input
              icon
              placeholder="搜索客户姓名、电话..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-warm-gray-400" />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  selectedTag === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                }`}
              >
                全部
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    selectedTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedIntention(null)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  selectedIntention === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                }`}
              >
                全部意向
              </button>
              {(['high', 'medium', 'low'] as IntentionLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedIntention(level)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1 ${
                    selectedIntention === level
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${INTENTION_LEVEL_COLORS[level]}`} />
                  {INTENTION_LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.map(customer => {
            const latestApt = getLatestAppointment(customer.id);
            return (
              <Card key={customer.id} hoverable className="cursor-pointer" onClick={() => openDetail(customer.id)}>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Avatar src={customer.avatar} alt={customer.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-warm-gray-800 flex items-center gap-1.5">
                        {customer.name}
                        {customer.intentionLevel && (
                          <span
                            className={`w-2 h-2 rounded-full ${INTENTION_LEVEL_COLORS[customer.intentionLevel]}`}
                            title={INTENTION_LEVEL_LABELS[customer.intentionLevel]}
                          />
                        )}
                      </h3>
                      <p className="text-sm text-warm-gray-500">{customer.gender === 'female' ? '女' : '男'} · {customer.age}岁</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-warm-gray-400">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {customer.intentionLevel && (
                      <Badge
                        variant={customer.intentionLevel === 'high' ? 'danger' : customer.intentionLevel === 'medium' ? 'warning' : 'default'}
                        size="sm"
                      >
                        <Star className="w-3 h-3 mr-0.5" />
                        {INTENTION_LEVEL_LABELS[customer.intentionLevel]}
                      </Badge>
                    )}
                    {customer.tags.map((tag, idx) => (
                      <Badge key={idx} variant={tag === '高意向' ? 'primary' : 'default'} size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {(customer.budget || (customer.concerns && customer.concerns.length > 0)) && (
                    <div className="mt-3 pt-3 border-t border-warm-gray-100 space-y-2">
                      {customer.budget && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <DollarSign className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-warm-gray-600">预算：{customer.budget}</span>
                        </div>
                      )}
                      {customer.concerns && customer.concerns.length > 0 && (
                        <div className="flex items-start gap-1.5 text-sm">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {customer.concerns.map((concern, idx) => (
                              <Badge key={idx} variant="warning" size="sm">{concern}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {latestApt && (
                    <div className="mt-3 pt-3 border-t border-warm-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-warm-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-primary-500" />
                          <span>最近预约</span>
                        </div>
                        <Badge variant={getStatusVariant(latestApt.status) as any} size="sm">
                          {APPOINTMENT_STATUS_LABELS[latestApt.status]}
                        </Badge>
                      </div>
                      <div className="mt-1.5 text-sm text-warm-gray-700 font-medium">
                        {dayjs(latestApt.appointmentTime).format('MM-DD HH:mm')} · {latestApt.project}
                      </div>
                      {latestApt.conversationProject && (
                        <div className="mt-0.5 text-xs text-warm-gray-400 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          来源：{latestApt.conversationProject}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-gray-100">
                    <div className="flex items-center gap-1 text-xs text-warm-gray-400">
                      <Calendar className="w-3 h-3" />
                      添加于 {dayjs(customer.createdAt).format('MM-DD')}
                    </div>
                    <Button variant="ghost" size="sm">
                      查看详情
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {showDetailModal && currentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-200">
              <div className="flex items-center gap-3">
                <Avatar src={currentCustomer.avatar} alt="" size="md" />
                <div>
                  <h3 className="text-lg font-serif font-semibold text-warm-gray-800 flex items-center gap-2">
                    {currentCustomer.name}
                    {currentCustomer.intentionLevel && (
                      <Badge
                        variant={currentCustomer.intentionLevel === 'high' ? 'danger' : currentCustomer.intentionLevel === 'medium' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {INTENTION_LEVEL_LABELS[currentCustomer.intentionLevel]}
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-warm-gray-500">
                    {currentCustomer.gender === 'female' ? '女' : '男'} · {currentCustomer.age}岁 · {currentCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedCustomer(null); }}
                className="p-1 rounded-md hover:bg-warm-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-warm-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-4 bg-warm-gray-50 rounded-lg">
                <p className="text-xs text-warm-gray-500 mb-3 font-medium">客户信息</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-warm-gray-400">联系电话：</span>
                    <span className="text-warm-gray-700">{currentCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-warm-gray-400">年龄性别：</span>
                    <span className="text-warm-gray-700">{currentCustomer.age}岁 {currentCustomer.gender === 'female' ? '女' : '男'}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-warm-gray-200 space-y-2">
                  {currentCustomer.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-warm-gray-600">预算：</span>
                      <span className="text-warm-gray-800 font-medium">{currentCustomer.budget}</span>
                    </div>
                  )}
                  {currentCustomer.concerns && currentCustomer.concerns.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span className="text-warm-gray-600">顾虑点：</span>
                      <div className="flex flex-wrap gap-1">
                        {currentCustomer.concerns.map((c, idx) => (
                          <Badge key={idx} variant="warning" size="sm">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentCustomer.tags.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Tag className="w-4 h-4 text-primary-500 mt-0.5" />
                      <span className="text-warm-gray-600">标签：</span>
                      <div className="flex flex-wrap gap-1">
                        {currentCustomer.tags.map((t, idx) => (
                          <Badge key={idx} variant="default" size="sm">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-warm-gray-50 rounded-lg">
                <p className="text-xs text-warm-gray-500 mb-3 font-medium flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  预约历史
                  <Badge variant="primary" size="sm">{customerAppointments.length}</Badge>
                </p>
                {customerAppointments.length === 0 ? (
                  <p className="text-sm text-warm-gray-400 text-center py-6">暂无预约记录</p>
                ) : (
                  <div className="space-y-2">
                    {customerAppointments.map((apt: Appointment) => (
                      <div
                        key={apt.id}
                        className="p-3 bg-white rounded-lg border border-warm-gray-200 hover:border-primary-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-500" />
                            <span className="font-medium text-warm-gray-800">
                              {dayjs(apt.appointmentTime).format('YYYY-MM-DD HH:mm')}
                            </span>
                          </div>
                          <Badge variant={getStatusVariant(apt.status) as any} size="sm">
                            {APPOINTMENT_STATUS_LABELS[apt.status]}
                          </Badge>
                        </div>
                        <div className="text-sm text-warm-gray-600 flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-warm-gray-400" />
                          {apt.project}
                        </div>
                        {apt.conversationProject && (
                          <div className="text-xs text-warm-gray-400 mt-1 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            来源会话：{apt.conversationProject}
                          </div>
                        )}
                        {apt.consultant && (
                          <div className="text-xs text-warm-gray-400 mt-0.5 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            咨询师：{apt.consultant.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-warm-gray-50 border-t border-warm-gray-200">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => { setShowDetailModal(false); setSelectedCustomer(null); }}>
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
