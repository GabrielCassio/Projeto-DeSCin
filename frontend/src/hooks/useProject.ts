import { useProjectStore } from '../stores/project.store';
import type { LiveProject } from '../stores/project.store';

export function useProject(ticker: string | undefined): {
  project: LiveProject | null;
  loading: boolean;
  error: string | null;
} {
  const project = useProjectStore(s =>
    ticker ? (s.projects.find(p => p.ticker === ticker) ?? null) : null
  );
  return {
    project,
    loading: false,
    error: project === null && !!ticker ? 'Projeto não encontrado' : null,
  };
}
