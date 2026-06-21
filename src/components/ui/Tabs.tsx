import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    onChange?.(key);
  };

  return (
    <div className={cn('flex gap-1 bg-warm-gray-100 p-1 rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150',
            activeTab === tab.key
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-warm-gray-500 hover:text-warm-gray-700'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
