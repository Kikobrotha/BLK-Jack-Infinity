import { cn } from '@/lib/utils';

type InfoPanelProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function InfoPanel({ title, description, className, children }: InfoPanelProps) {
  return (
    <section className={cn('rounded-xl border border-slate-800 bg-slate-900/70 p-5', className)}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
