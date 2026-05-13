import { useEffect } from 'react';
import { useProjectStore } from '../stores/project.store';
import type { LiveProject } from '../stores/project.store';

export function useProjects(): { projects: LiveProject[]; loading: boolean; error: string | null } {
  const { projects, loading, fetchProjects, fetched } = useProjectStore();

  useEffect(() => {
    if (!fetched) fetchProjects();
  }, [fetched, fetchProjects]);

  return { projects, loading, error: null };
}
