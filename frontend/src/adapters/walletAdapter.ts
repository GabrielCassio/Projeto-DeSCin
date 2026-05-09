import type { ApiWallet } from '../types/api';
import type { WalletData } from '../types';

export function adaptWallet(api: ApiWallet): WalletData {
  return {
    availableBalance: api.balance,
    totalInvested: 0,
    totalValue: api.balance,
    assets: [],
  };
}
