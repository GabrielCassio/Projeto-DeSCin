import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../../types';
import { getTickerColor, getTickerInitials } from '../../utils/color';
import { formatCurrency, formatNumber } from '../../utils/format';
import { ChangeBadge, Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const color = getTickerColor(project.ticker);
  const initials = getTickerInitials(project.ticker);
  const soldPercent = Math.round(
    ((project.totalSupply - project.availableTokens) / project.totalSupply) * 100,
  );
  const code = project.ticker.split(':')[1];

  return (
    <Card
      interactive
      onClick={() => navigate(`/projetos/${code}`)}
      className="group flex flex-col overflow-hidden"
      padding="none"
    >
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              'text-white font-semibold text-xs font-mono flex-shrink-0',
              'transition-transform group-hover:scale-105'
            )}
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-medium text-text-muted">
                {project.ticker}
              </span>
              <Badge size="xs">{project.area}</Badge>
            </div>
            <h3 className="font-medium text-text-primary text-sm leading-snug line-clamp-2">
              {project.name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-text-tertiary line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <p className="text-xs text-text-muted">
          {project.university}
        </p>

        <div className="mt-auto pt-4 border-t border-border-subtle">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Preço</p>
              <p className="font-mono font-semibold text-text-primary text-lg tabular-nums">
                {formatCurrency(project.currentPrice)}
              </p>
            </div>
            <ChangeBadge value={project.change24h} />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-muted mb-2">
              <span>Tokens vendidos</span>
              <span className="font-mono text-text-secondary tabular-nums">{soldPercent}%</span>
            </div>
            <div className="h-1 bg-bg-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${soldPercent}%`, background: color }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">
              Vol: <span className="font-mono text-text-secondary tabular-nums">{formatNumber(project.volume)}</span>
            </span>
            <span
              className={cn(
                'flex items-center gap-1 font-medium',
                'text-accent group-hover:gap-2 transition-all duration-150'
              )}
            >
              Ver projeto
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
