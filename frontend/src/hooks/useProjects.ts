import { useProjectStore } from '../stores/project.store';
import type { LiveProject } from '../stores/project.store';

export function useProjects(): { projects: LiveProject[]; loading: boolean; error: string | null } {
  const projects = useProjectStore(s => s.projects);
  return { projects, loading: false, error: null };
}
