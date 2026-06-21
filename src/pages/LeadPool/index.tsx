import { useState, useMemo } from 'react';
import { Inbox, Filter, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { LeadCard } from '@/components/common/LeadCard';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import type { Source, ProjectCategory } from '@/types';
import { SOURCE_LABELS, PROJECT_CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

const sourceFilters: { key: Source | 'all'; label: string }[] = [
  { key: 'all', label: '全部平台' },
  { key: 'meituan', label: '美团' },
  { key: 'xinyang', label: '新氧' },
];

const categoryFilters: { key: ProjectCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部项目' },
  { key: 'rhinoplasty', label: '隆鼻' },
  { key: 'skin', label: '皮肤' },
  { key: 'antiaging', label: '抗衰' },
  { key: 'breast', label: '隆胸' },
  { key: 'body', label: '塑形' },
  { key: 'other', label: '其他' },
];

export function LeadPool() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const leads = useAppStore((state) => state.leads);
  const claimLead = useAppStore((state) => state.claimLead);
  const autoAssignLead = useAppStore((state) => state.autoAssignLead);

  const pendingLeads = useMemo(() => {
    return leads
      .filter((l) => l.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads]);

  const [activeTab, setActiveTab] = useState('pending');
  const [sourceFilter, setSourceFilter] = useState<Source | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | 'all'>('all');
  const [searchText, setSearchText] = useState('');

  const handleClaim = (leadId: string) => {
    if (currentUser) {
      claimLead(leadId, currentUser.id);
      navigate('/conversation');
    }
  };

  const handleAutoAssign = (leadId: string) => {
    const result = autoAssignLead(leadId);
    if (result) {
      navigate('/conversation');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (activeTab === 'pending' && lead.status !== 'pending') return false;
    if (activeTab === 'mine' && lead.consultantId !== currentUser?.id) return false;
    if (activeTab === 'all' && false) return false;

    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    if (categoryFilter !== 'all' && lead.projectCategory !== categoryFilter) return false;
    if (searchText && !lead.customer.name.includes(searchText) && !lead.project.includes(searchText)) {
      return false;
    }
    return true;
  });

  const sortedLeads = [...filteredLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const tabItems = [
    { key: 'pending', label: `待接待 (${pendingLeads.length})` },
    { key: 'mine', label: '我的线索' },
    { key: 'all', label: '全部线索' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-warm-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-warm-gray-800">线索池</h1>
              <p className="text-sm text-warm-gray-500">美团与新氧线索统一管理，高效接待</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
            <Button variant="primary" size="sm">
              <Filter className="w-4 h-4" />
              高级筛选
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-64">
            <Input
              icon
              placeholder="搜索客户姓名、项目..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            {sourceFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSourceFilter(filter.key as Source | 'all')}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-all',
                  sourceFilter === filter.key
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-warm-gray-600 hover:bg-warm-gray-100'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-warm-gray-200 mx-1" />

          <div className="flex items-center gap-1 flex-wrap">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setCategoryFilter(filter.key as ProjectCategory | 'all')}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-md transition-all',
                  categoryFilter === filter.key
                    ? 'bg-warm-gray-800 text-white font-medium'
                    : 'text-warm-gray-600 hover:bg-warm-gray-100'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <Tabs tabs={tabItems} defaultTab="pending" onChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-auto p-6">
        {sortedLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-warm-gray-400">
            <Inbox className="w-12 h-12 mb-3 opacity-50" />
            <p>暂无线索</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClaim={handleClaim}
                onAutoAssign={handleAutoAssign}
                showClaimButton={activeTab === 'pending'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6">
        <Badge variant="danger" className="animate-bounce-soft">
          待接待 {pendingLeads.length} 条
        </Badge>
      </div>
    </div>
  );
}
