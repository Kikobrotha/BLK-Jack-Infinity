'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type InfoPanelProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  collapsible?: boolean;
  collapseStorageKey?: string;
  defaultCollapsed?: boolean;
};

export function InfoPanel({
  title,
  description,
  className,
  children,
  collapsible = false,
  collapseStorageKey,
  defaultCollapsed = false,
}: InfoPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    if (!collapseStorageKey) {
      return;
    }

    const savedValue = window.localStorage.getItem(collapseStorageKey);
    if (!savedValue) {
      return;
    }

    setIsCollapsed(savedValue === 'collapsed');
  }, [collapseStorageKey]);

  useEffect(() => {
    if (!collapseStorageKey) {
      return;
    }

    window.localStorage.setItem(collapseStorageKey, isCollapsed ? 'collapsed' : 'expanded');
  }, [collapseStorageKey, isCollapsed]);

  return (
    <section className={cn('rounded-xl border border-slate-800 bg-slate-900/70 p-5', className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(prev => !prev)}
            aria-expanded={!isCollapsed}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs font-medium text-slate-200 hover:border-slate-500"
          >
            {isCollapsed ? 'Expand' : 'Minimize'}
          </button>
        ) : null}
      </div>
      {!isCollapsed ? (
        <>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
          <div className="mt-4">{children}</div>
        </>
      ) : null}
    </section>
  );
}
