export type Role = 'investor' | 'founder' | 'curator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  roles: Role[];
  createdAt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  link?: string;
}

export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CurationHistory {
  id: string;
  action: 'approved' | 'rejected' | 'changes_requested';
  curatorId: string;
  curatorName: string;
  reason?: string;
  createdAt: string;
}

export interface Tokenomics {
  founders: number;
  community: number;
  liquidity: number;
  reserve: number;
}

export interface Project {
  ticker: string;
  name: string;
  university: string;
  area: Area;
  description: string;
  descriptionLong?: string;
  totalSupply: number;
  availableTokens: number;
  currentPrice: number;
  initialPrice: number;
  change24h: number;
  volume: number;
  team: TeamMember[];
  tokenomics: Tokenomics;
  logo?: string;
  status: ProjectStatus;
  founderId: string;
  founderName: string;
  submittedAt: string;
  approvedAt?: string;
  updates: ProjectUpdate[];
  curationHistory: CurationHistory[];
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface PortfolioPoint {
  timestamp: string;
  value: number;
}

export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdraw';

export interface Transaction {
  hash: string;
  type: TransactionType;
  ticker?: string;
  projectName?: string;
  amount: number;
  value: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  counterparty?: string;
  description?: string;
  method?: 'pix' | 'bank';
}

export interface Asset {
  ticker: string;
  projectName: string;
  tokensOwned: number;
  averagePrice: number;
  currentValue: number;
  change24h: number;
  pnl: number;
  pnlPercent: number;
  priceHistory: number[];
}

export interface WalletData {
  availableBalance: number;
  totalInvested: number;
  totalValue: number;
  assets: Asset[];
}

export type Period = '1D' | '7D' | '1M' | '3M' | '1A' | 'Tudo';

export type Area = 'Todas' | 'Tecnologia' | 'Saúde' | 'Engenharia' | 'Humanas' | 'Ciências' | 'Sustentabilidade';

export type SortBy = 'volume' | 'recent' | 'change' | 'ending_soon';

export type ThemeMode = 'light' | 'dark' | 'system';
