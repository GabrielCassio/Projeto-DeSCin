export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000)  return 'agora';
  if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `há ${Math.floor(diff / 3_600_000)}h`;
  return `há ${Math.floor(diff / 86_400_000)} dias`;
}

export function generateHash(): string {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
