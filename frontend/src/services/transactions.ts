import type { Transaction } from '../types';
import type { ApiInvestPayload } from '../types/api';
import { USE_MOCKS } from '../constants';
import { MOCK_TRANSACTIONS } from '../mocks/data';
import api from './api';

interface BuyPayload {
  ticker: string;
  amount: number;
}

interface SellPayload {
  ticker: string;
  amount: number;
}

interface DepositPayload {
  value: number;
}

function getWalletId(): string {
  return localStorage.getItem('wallet_id') ?? '';
}

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    if (USE_MOCKS) return MOCK_TRANSACTIONS;
    try {
      const { data } = await api.get<Transaction[]>('/api/wallet/transactions');
      return data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  },

  async buy(payload: BuyPayload & { projectId: number; price: number }): Promise<Transaction> {
    try {
      const userId = localStorage.getItem('user_id');
      const res = await api.post(`/projects/${payload.projectId}/buy`, {
        user_id: parseInt(userId ?? '0'),
        tokens: payload.amount,
        price: payload.price,
      });
      const total = res.data.total;
      // Atualiza balance local
      const currentBalance = parseFloat(localStorage.getItem('user_balance') ?? '0');
      localStorage.setItem('user_balance', String(currentBalance - total));
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'buy',
        ticker: payload.ticker,
        amount: payload.amount,
        value: total,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Failed to buy:', error);
      throw new Error('Investment failed');
    }
  },

  async sell(payload: SellPayload): Promise<Transaction> {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'sell',
        ticker: payload.ticker,
        amount: payload.amount,
        value: payload.amount * 5,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
      };
    }
    try {
      const refundPayload: ApiInvestPayload = {
        sender: getWalletId(),
        amount: payload.amount,
        signature: '',
      };
      await api.post<void>(
        `/api/projects/${encodeURIComponent(payload.ticker)}/refund`,
        refundPayload,
      );
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'sell',
        ticker: payload.ticker,
        amount: payload.amount,
        value: payload.amount,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Failed to refund:', error);
      throw new Error('Refund failed');
    }
  },

  async deposit(payload: DepositPayload): Promise<Transaction> {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        hash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        type: 'deposit',
        amount: payload.value,
        value: payload.value,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
      };
    }
    try {
      const { data } = await api.post<Transaction>('/api/transactions/deposit', payload);
      return data;
    } catch (error) {
      console.error('Failed to deposit:', error);
      throw new Error('Deposit failed');
    }
  },
};
