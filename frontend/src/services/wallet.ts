import type { WalletData, PortfolioPoint } from '../types';
import type { ApiWallet } from '../types/api';
import { USE_MOCKS } from '../constants';
import { MOCK_WALLET, MOCK_PORTFOLIO_HISTORY } from '../mocks/data';
import { adaptWallet } from '../adapters/walletAdapter';
import api from './api';

function getWalletId(): string {
  return localStorage.getItem('wallet_id') ?? '';
}

export const walletService = {
  async getWallet(): Promise<WalletData> {
    if (USE_MOCKS) return MOCK_WALLET;
    try {
      const walletId = getWalletId();
      if (!walletId) {
        const { data } = await api.post<ApiWallet>('/api/wallets', {});
        localStorage.setItem('wallet_id', data.wallet_id);
        return adaptWallet(data);
      }
      const { data } = await api.get<ApiWallet>(`/api/wallets/${encodeURIComponent(walletId)}`);
      return adaptWallet(data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      throw new Error('Unable to load wallet');
    }
  },

  async getPortfolioHistory(): Promise<PortfolioPoint[]> {
    if (USE_MOCKS) return MOCK_PORTFOLIO_HISTORY;
    try {
      const { data } = await api.get<PortfolioPoint[]>('/api/wallet/portfolio-history');
      return data;
    } catch (error) {
      console.error('Failed to fetch portfolio history:', error);
      return [];
    }
  },
};
