import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowDownToLine, Copy, Check } from 'lucide-react';
import { AppLayout, PageHeader, Section } from '../components/layout/AppLayout';
import { AssetRow } from '../components/project/AssetRow';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonRow } from '../components/ui/Skeleton';
import { useWalletStore } from '../stores/wallet.store';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDateTime, truncateHash } from '../utils/format';
import { TickerLabel } from '../components/ui/TickerLabel';
import { Badge } from '../components/ui/Badge';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="lg">
      <p className="text-xs font-medium tracking-widest uppercase text-text-muted mb-2">{label}</p>
      <p className="font-mono font-semibold text-2xl text-text-primary tabular-nums">{value}</p>
    </Card>
  );
}

export default function Wallet() {
  const navigate = useNavigate();
  const { availableBalance, totalInvested, assets, loading } = useWalletStore();
  const { transactions, loading: txLoading } = useTransactions();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const total = availableBalance + totalInvested;

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Carteira"
        subtitle="Patrimônio"
        description="Seu patrimônio e histórico de transações"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Saldo disponível" value={formatCurrency(availableBalance)} />
        <StatCard label="Total investido" value={formatCurrency(totalInvested)} />
        <StatCard label="Patrimônio total" value={formatCurrency(total)} />
      </div>

      <Section
        title="Meus Ativos"
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate('/explorar')}>
            Explorar projetos
          </Button>
        }
      >
        <Card padding="none">
          {loading ? (
            <div className="divide-y divide-border-subtle">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : assets.length === 0 ? (
            <EmptyState
              icon={<WalletIcon size={24} />}
              title="Nenhum ativo"
              description="Você ainda não comprou tokens de nenhum projeto."
              action={
                <Button onClick={() => navigate('/explorar')}>Explorar projetos</Button>
              }
            />
          ) : (
            <div className="divide-y divide-border-subtle">
              {assets.map(asset => (
                <AssetRow key={asset.ticker} asset={asset} />
              ))}
            </div>
          )}
        </Card>
      </Section>

      <Section title="Histórico de Transações">
        <Card padding="none">
          {txLoading ? (
            <div className="divide-y divide-border-subtle">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={<ArrowDownToLine size={24} />}
              title="Sem transações"
              description="Suas transações aparecerão aqui após o primeiro depósito ou compra."
            />
          ) : (
            <div>
              <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider text-text-muted border-b border-border-subtle">
                <span>Tipo</span>
                <span className="col-span-2">Projeto / Descrição</span>
                <span className="text-right">Valor</span>
                <span className="text-right">Data</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {transactions.map(tx => (
                  <div
                    key={tx.hash}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-6 py-4 hover:bg-bg-surface transition-colors duration-150"
                  >
                    <div>
                      <Badge variant={tx.type === 'deposit' ? 'info' : 'accent'}>
                        {tx.type === 'deposit' ? 'Depósito' : tx.type === 'buy' ? 'Compra' : tx.type === 'sell' ? 'Venda' : 'Saque'}
                      </Badge>
                    </div>
                    <div className="sm:col-span-2">
                      {tx.ticker ? (
                        <TickerLabel ticker={tx.ticker} size="sm" />
                      ) : (
                        <span className="text-sm text-text-secondary">Depósito em conta</span>
                      )}
                      <p className="text-xs text-text-muted mt-0.5 font-mono flex items-center gap-1.5">
                        {truncateHash(tx.hash)}
                        <button
                          onClick={() => copyHash(tx.hash)}
                          className="text-text-muted hover:text-text-primary transition-colors"
                          title="Copiar hash"
                        >
                          {copiedHash === tx.hash ? (
                            <Check size={12} className="text-success" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium text-text-primary tabular-nums">{formatCurrency(tx.value)}</p>
                      {tx.type === 'buy' && (
                        <p className="text-xs text-text-muted">{tx.amount} tokens</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">{formatDateTime(tx.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </Section>
    </AppLayout>
  );
}
