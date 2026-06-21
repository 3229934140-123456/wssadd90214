import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export function Input({ icon = false, className, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
      )}
      <input
        className={cn(
          'w-full px-3 py-2 text-sm border border-warm-gray-300 rounded-md bg-white placeholder-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
  );
}
