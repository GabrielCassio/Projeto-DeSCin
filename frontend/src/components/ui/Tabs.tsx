import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className
}: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && tabsRef.current) {
      const tabRect = activeRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
  };

  if (variant === 'underline') {
    return (
      <div ref={tabsRef} className={cn('relative border-b border-border-subtle', className)}>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={tab.id === activeTab ? activeRef : null}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center font-medium transition-colors duration-150 pb-3',
                sizeClasses[size],
                tab.id === activeTab
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-1.5 px-1.5 py-0.5 text-2xs bg-bg-surface rounded-full tabular-nums">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-0.5 bg-accent rounded-full transition-all duration-200"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex gap-1', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center font-medium rounded-lg transition-all duration-150',
              sizeClasses[size],
              tab.id === activeTab
                ? 'bg-accent text-bg'
                : 'text-text-muted hover:bg-bg-surface hover:text-text-primary'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={cn(
                'ml-1.5 px-1.5 py-0.5 text-2xs rounded-full tabular-nums',
                tab.id === activeTab
                  ? 'bg-bg/20 text-bg'
                  : 'bg-bg-active'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={tabsRef}
      className={cn('relative flex gap-1 p-1 bg-bg-surface rounded-xl', className)}
    >
      <div
        className={cn(
          'absolute top-1 h-[calc(100%-8px)]',
          'bg-bg-elevated rounded-lg',
          'shadow-sm border border-border-subtle',
          'transition-all duration-200'
        )}
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={tab.id === activeTab ? activeRef : null}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative z-10 flex items-center font-medium rounded-lg transition-colors duration-150',
            sizeClasses[size],
            tab.id === activeTab
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-1.5 px-1.5 py-0.5 text-2xs bg-accent/15 text-accent rounded-full tabular-nums">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  children: ReactNode;
  value: string;
  activeValue: string;
  className?: string;
}

export function TabPanel({ children, value, activeValue, className }: TabPanelProps) {
  if (value !== activeValue) return null;

  return (
    <div className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}
