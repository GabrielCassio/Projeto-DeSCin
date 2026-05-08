import { create } from 'zustand';
import type { Project, PricePoint } from '../types';
import { MOCK_PROJECTS, MOCK_PRICE_HISTORIES } from '../mocks/data';

export interface LiveProject extends Project {
  priceHistory: PricePoint[];
  openPrice: number;
  circulatingSupply: number;
  holders: number;
  marketCap: number;
  volume24h: number;
  change7d: number;
  volatility: number;
  liquidity: number;
}

interface ProjectStore {
  projects: LiveProject[];
  tick: () => void;
  recordBuy: (ticker: string, qty: number, price: number) => void;
  recordSell: (ticker: string, qty: number, price: number) => void;
}

const VOLATILITY: Record<string, number> = {
  'PROJ:HIDRO24': 0.013,
  'PROJ:ROBO25':  0.017,
  'PROJ:BIOM24':  0.021,
  'PROJ:SOLA25':  0.011,
  'PROJ:NEURO24': 0.024,
  'PROJ:AGRO25':  0.010,
  'PROJ:CULT24':  0.015,
  'PROJ:QUIM25':  0.019,
  'PROJ:NANO26':  0.017,
  'PROJ:REAB26':  0.013,
  'PROJ:AQUA26':  0.011,
  'PROJ:LING26':  0.015,
};

function calcChange7d(history: PricePoint[], currentPrice: number): number {
  if (history.length < 8) return 0;
  const price7dAgo = history[Math.max(0, history.length - 8)]?.price ?? currentPrice;
  if (!price7dAgo) return 0;
  return +((( currentPrice - price7dAgo) / price7dAgo) * 100).toFixed(2);
}

function newPoint(price: number): PricePoint {
  return { timestamp: new Date().toISOString().slice(0, 16), price: +price.toFixed(4) };
}

function initProject(p: Project): LiveProject {
  const history = MOCK_PRICE_HISTORIES[p.ticker] ?? [];
  const vol = VOLATILITY[p.ticker] ?? 0.015;
  const liquidity = Math.max(p.volume / 50, 1000);
  const circulating = p.totalSupply - p.availableTokens;
  return {
    ...p,
    priceHistory: [...history],
    openPrice: p.currentPrice,
    circulatingSupply: circulating,
    holders: Math.max(1, Math.floor(circulating / 50)),
    marketCap: p.currentPrice * p.totalSupply,
    volume24h: p.volume,
    change7d: calcChange7d(history, p.currentPrice),
    volatility: vol,
    liquidity,
  };
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: MOCK_PROJECTS.map(initProject),

  recordBuy: (ticker, qty, price) => {
    set(s => ({
      projects: s.projects.map(p => {
        if (p.ticker !== ticker) return p;
        const safePrice = price > 0 ? price : p.currentPrice;
        const impact = Math.min((qty * safePrice) / (p.liquidity * 80), 0.05);
        const newPrice = Math.max(0.01, +(p.currentPrice * (1 + impact)).toFixed(4));
        const newHistory = [...p.priceHistory, newPoint(newPrice)];
        const newChange24h = p.openPrice > 0
          ? +((( newPrice - p.openPrice) / p.openPrice) * 100).toFixed(2)
          : p.change24h;
        return {
          ...p,
          currentPrice: newPrice,
          availableTokens: Math.max(0, p.availableTokens - qty),
          circulatingSupply: p.circulatingSupply + qty,
          holders: p.holders + 1,
          marketCap: newPrice * p.totalSupply,
          volume24h: p.volume24h + qty * safePrice,
          change24h: newChange24h,
          change7d: calcChange7d(newHistory, newPrice),
          priceHistory: newHistory,
        };
      }),
    }));
  },

  recordSell: (ticker, qty, price) => {
    set(s => ({
      projects: s.projects.map(p => {
        if (p.ticker !== ticker) return p;
        const safePrice = price > 0 ? price : p.currentPrice;
        const impact = Math.min((qty * safePrice) / (p.liquidity * 80), 0.04);
        const newPrice = Math.max(0.01, +(p.currentPrice * (1 - impact)).toFixed(4));
        const newHistory = [...p.priceHistory, newPoint(newPrice)];
        const newChange24h = p.openPrice > 0
          ? +((( newPrice - p.openPrice) / p.openPrice) * 100).toFixed(2)
          : p.change24h;
        return {
          ...p,
          currentPrice: newPrice,
          availableTokens: Math.min(p.totalSupply, p.availableTokens + qty),
          circulatingSupply: Math.max(0, p.circulatingSupply - qty),
          marketCap: newPrice * p.totalSupply,
          volume24h: p.volume24h + qty * safePrice,
          change24h: newChange24h,
          change7d: calcChange7d(newHistory, newPrice),
          priceHistory: newHistory,
        };
      }),
    }));
  },

  tick: () => {
    set(s => ({
      projects: s.projects.map(p => {
        // Slight upward bias: 0.485 skews positive
        const noise = (Math.random() - 0.485) * p.volatility * 2;
        const newPrice = Math.max(p.openPrice * 0.4, +(p.currentPrice * (1 + noise)).toFixed(4));
        const newChange24h = p.openPrice > 0
          ? +((( newPrice - p.openPrice) / p.openPrice) * 100).toFixed(2)
          : p.change24h;

        // Record a price point ~20% of ticks to keep chart alive
        const record = Math.random() < 0.20;
        const newHistory = record ? [...p.priceHistory, newPoint(newPrice)] : p.priceHistory;

        // Small volume drift per tick
        const drift = p.volume24h * Math.random() * 0.0015;

        return {
          ...p,
          currentPrice: newPrice,
          marketCap: newPrice * p.totalSupply,
          volume24h: p.volume24h + drift,
          change24h: newChange24h,
          change7d: record ? calcChange7d(newHistory, newPrice) : p.change7d,
          priceHistory: newHistory,
        };
      }),
    }));
  },
}));
