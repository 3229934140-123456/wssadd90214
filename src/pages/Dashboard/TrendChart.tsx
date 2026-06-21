import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { hourlyTrendData, weekTrendData } from '@/data/dashboard';
import { useState } from 'react';

export function TrendChart() {
  const [viewMode, setViewMode] = useState<'hour' | 'week'>('hour');

  const data: { name: string; leads: number; appointments: number }[] = 
    viewMode === 'hour' 
      ? hourlyTrendData.map(d => ({ name: d.hour, leads: d.leads, appointments: d.appointments }))
      : weekTrendData.map(d => ({ name: d.day, leads: d.leads, appointments: d.appointments }));
  const xKey = 'name';

  return (
    <div className="bg-white rounded-xl border border-warm-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif font-semibold text-warm-gray-800">趋势分析</h3>
          <p className="text-sm text-warm-gray-500 mt-1">线索与预约量趋势</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('hour')}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              viewMode === 'hour'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-warm-gray-500 hover:bg-warm-gray-50'
            }`}
          >
            今日分时
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              viewMode === 'week'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-warm-gray-500 hover:bg-warm-gray-50'
            }`}
          >
            本周趋势
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B76E79" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#B76E79" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#78716C' }}
              axisLine={{ stroke: '#E7E5E4' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#78716C' }}
              axisLine={{ stroke: '#E7E5E4' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E7E5E4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              name="线索量"
              stroke="#B76E79"
              strokeWidth={2}
              fill="url(#colorLeads)"
            />
            <Area
              type="monotone"
              dataKey="appointments"
              name="预约数"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorAppointments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-warm-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-sm text-warm-gray-600">线索量</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-warm-gray-600">预约数</span>
        </div>
      </div>
    </div>
  );
}
