import { cn } from '@/lib/utils';
import type { ImgHTMLAttributes } from 'react';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-yellow-500',
};

export function Avatar({ size = 'md', status, className, ...props }: AvatarProps) {
  return (
    <div className="relative inline-block">
      <img
        className={cn(
          'rounded-full object-cover border-2 border-white',
          sizeStyles[size],
          className
        )}
        {...props}
      />
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
