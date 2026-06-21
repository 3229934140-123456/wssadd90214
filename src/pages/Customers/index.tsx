import { useState } from 'react';
import { Users, Search, Filter, Phone, Calendar, Tag } from 'lucide-react';
import { customers } from '@/data/customers';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import dayjs from 'dayjs';

export function Customers() {
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  const filteredCustomers = customers.filter(customer => {
    if (searchText && !customer.name.includes(searchText) && !customer.phone.includes(searchText)) {
      return false;
    }
    if (selectedTag && !customer.tags.includes(selectedTag)) {
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

        <div className="flex items-center gap-4">
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
                  <h3 className="font-medium text-warm-gray-800">{customer.name}</h3>
                  <p className="text-sm text-warm-gray-500">{customer.gender === 'female' ? '女' : '男'} · {customer.age}岁</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-warm-gray-400">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {customer.tags.map((tag, idx) => (
                  <Badge key={idx} variant={tag === '高意向' ? 'primary' : 'default'} size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

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
