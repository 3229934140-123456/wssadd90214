import { useState, useMemo } from 'react';
import { Users, Search, Filter, Phone, Calendar, Tag, DollarSign, AlertCircle, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { INTENTION_LEVEL_LABELS, INTENTION_LEVEL_COLORS } from '@/types';
import type { IntentionLevel } from '@/types';
import dayjs from 'dayjs';

export function Customers() {
  const leads = useAppStore((state) => state.leads);
  const conversations = useAppStore((state) => state.conversations);

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

  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<IntentionLevel | null>(null);

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
    return true;
  });

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
          <Button>
            <Filter className="w-4 h-4" />
            高级筛选
          </Button>
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
          {filteredCustomers.map(customer => (
            <Card key={customer.id} hoverable className="cursor-pointer">
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

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-gray-100">
                  <div className="flex items-center gap-1 text-xs text-warm-gray-400">
                    <Calendar className="w-3 h-3" />
                    添加于 {dayjs(customer.createdAt).format('MM-DD')}
                  </div>
                  <Button variant="ghost" size="sm">查看详情</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
