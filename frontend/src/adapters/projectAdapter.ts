import type { ApiProject } from '../types/api';
import type { Project, ProjectStatus, Area } from '../types';

const VALID_STATUSES: ProjectStatus[] = ['pending', 'approved', 'rejected', 'changes_requested'];
const VALID_AREAS: Area[] = ['Todas', 'Tecnologia', 'Saúde', 'Engenharia', 'Humanas', 'Ciências', 'Sustentabilidade'];

function toProjectStatus(raw: string): ProjectStatus {
  return VALID_STATUSES.includes(raw as ProjectStatus)
    ? (raw as ProjectStatus)
    : 'pending';
}

function toArea(raw: string): Area {
  return VALID_AREAS.includes(raw as Area)
    ? (raw as Area)
    : 'Tecnologia';
}

export function adaptProject(api: ApiProject): Project {
  const available = Math.max(0, api.target_funding - api.total_funding);
  return {
    ticker: api.project_id,
    name: api.name,
    description: api.description,
    area: toArea(api.category),
    university: 'UFPE',
    totalSupply: api.target_funding,
    availableTokens: available,
    currentPrice: api.roi_estimate,
    initialPrice: api.roi_estimate,
    change24h: 0,
    volume: api.total_funding,
    team: [],
    tokenomics: { founders: 0, community: 0, liquidity: 0, reserve: 0 },
    status: toProjectStatus(api.status),
    founderId: '',
    founderName: '',
    submittedAt: api.created_at,
    updates: [],
    curationHistory: [],
  };
}

export function adaptProjectToApi(project: Partial<Project>): Partial<ApiProject> {
  return {
    project_id: project.ticker,
    name: project.name,
    description: project.description,
    category: project.area,
    target_funding: project.totalSupply,
    roi_estimate: project.currentPrice,
  };
}
