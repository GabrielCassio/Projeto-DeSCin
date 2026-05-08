import { useState, useEffect } from 'react';
import type { PortfolioPoint, Period } from '../types';
import { walletService } from '../services/wallet';
import { filterPriceHistory, filterPortfolioHistory } from '../utils/period';
import { useProjectStore } from '../stores/project.store';

export function usePriceHistory(ticker: string | undefined, period: Period) {
  const allData = useProjectStore(s =>
    ticker ? (s.projects.find(p => p.ticker === ticker)?.priceHistory ?? []) : []
  );
  return { data: filterPriceHistory(allData, period), loading: false };
}

export function usePortfolioHistory(period: Period) {
  const [allData, setAllData] = useState<PortfolioPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    walletService
      .getPortfolioHistory()
      .then(data => { if (!cancelled) setAllData(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data: filterPortfolioHistory(allData, period), loading };
}
