
"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps extends React.SVGProps<SVGSVGElement> {
  value: number;
}

export const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  ({ className, value, ...props }, ref) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <svg
        ref={ref}
        width="150"
        height="150"
        viewBox="0 0 100 100"
        className={cn('transform -rotate-90', className)}
        {...props}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          className="stroke-secondary"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="stroke-primary transition-all duration-500"
          fill="transparent"
        />
      </svg>
    );
  }
);
ProgressCircle.displayName = 'ProgressCircle';
