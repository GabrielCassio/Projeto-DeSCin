import { create } from 'zustand';
import type { WalletData, Asset } from '../types';
import { walletService } from '../services/wallet';

interface WalletStore extends WalletData {
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  optimisticDeposit: (amount: number) => void;
  optimisticWithdraw: (amount: number) => void;
  optimisticBuy: (ticker: string, projectName: string, tokens: number, value: number, price: number) => void;
  optimisticSell: (ticker: string, tokens: number, value: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  availableBalance: 0,
  totalInvested: 0,
  totalValue: 0,
  assets: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await walletService.getWallet();
      set({ ...data, loading: false });
    } catch {
      set({ loading: false, error: 'Falha ao carregar carteira' });
    }
  },

  optimisticDeposit: (amount) => {
    set((s) => ({
      availableBalance: s.availableBalance + amount,
      totalValue: s.totalValue + amount,
    }));
  },

  optimisticWithdraw: (amount) => {
    set((s) => ({
      availableBalance: s.availableBalance - amount,
      totalValue: s.totalValue - amount,
    }));
  },

  optimisticBuy: (ticker, projectName, tokens, value, price) => {
    set((s) => {
      const existing = s.assets.find((a) => a.ticker === ticker);
      let assets: Asset[];

      if (existing) {
        const totalTokens = existing.tokensOwned + tokens;
        const totalCost = existing.averagePrice * existing.tokensOwned + value;
        const newAvgPrice = totalCost / totalTokens;

        assets = s.assets.map((a) =>
          a.ticker === ticker
            ? {
                ...a,
                tokensOwned: totalTokens,
                averagePrice: newAvgPrice,
                currentValue: totalTokens * price,
                pnl: (price - newAvgPrice) * totalTokens,
                pnlPercent: ((price - newAvgPrice) / newAvgPrice) * 100,
              }
            : a
        );
      } else {
        assets = [
          ...s.assets,
          {
            ticker,
            projectName,
            tokensOwned: tokens,
            averagePrice: price,
            currentValue: value,
            change24h: 0,
            pnl: 0,
            pnlPercent: 0,
            priceHistory: [],
          },
        ];
      }

      return {
        assets,
        availableBalance: s.availableBalance - value,
        totalInvested: s.totalInvested + value,
      };
    });
  },

  optimisticSell: (ticker, tokens, value) => {
    set((s) => {
      const assets = s.assets
        .map((a) => {
          if (a.ticker !== ticker) return a;
          const newTokens = a.tokensOwned - tokens;
          if (newTokens <= 0) return null;
          return {
            ...a,
            tokensOwned: newTokens,
            currentValue: a.currentValue - value,
          };
        })
        .filter((a): a is Asset => a !== null);

      return {
        assets,
        availableBalance: s.availableBalance + value,
        totalInvested: Math.max(0, s.totalInvested - value),
      };
    });
  },
}));
