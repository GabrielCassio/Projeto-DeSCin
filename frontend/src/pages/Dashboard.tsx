import { AppLayout } from '../components/layout/AppLayout';
import { MarketBriefing } from '../components/dashboard/MarketBriefing';
import { PortfolioOverview } from '../components/dashboard/PortfolioOverview';
import { DashboardChart } from '../components/dashboard/DashboardChart';
import { AssetsTable } from '../components/dashboard/AssetsTable';
import { TopMovers } from '../components/dashboard/TopMovers';
import { LiveFeed } from '../components/dashboard/LiveFeed';
import { MarketStats } from '../components/dashboard/MarketStats';
import { FeaturedProjects } from '../components/dashboard/FeaturedProjects';

const GLASS_PANEL: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
  padding: '28px 32px',
};

export default function Dashboard() {
  return (
    <AppLayout>
      {/* ── Section 1: Editorial hero ── */}
      <section className="page-s1" style={{ marginBottom: 48 }}>
        <MarketBriefing />
      </section>

      {/* ── Section 2: Portfolio overview (left 5col) + Chart (right 7col) ── */}
      <section className="page-s2" style={{ marginBottom: 32 }}>
        <div className="dash-grid-57">
          {/* Portfolio overview */}
          <div style={GLASS_PANEL}>
            <PortfolioOverview />
          </div>

          {/* Performance chart */}
          <div style={{ ...GLASS_PANEL, padding: '28px 24px' }}>
            <DashboardChart />
          </div>
        </div>
      </section>

      {/* ── Section 3: Assets table (left 7col) + Top movers (right 5col) ── */}
      <section className="page-s3" style={{ marginBottom: 32 }}>
        <div className="dash-grid-75">
          <AssetsTable />
          <TopMovers />
        </div>
      </section>

      {/* ── Section 4: Live feed (left 8col) + Market stats (right 4col) ── */}
      <section className="page-s4" style={{ marginBottom: 32 }}>
        <div className="dash-grid-84">
          <LiveFeed />
          <MarketStats />
        </div>
      </section>

      {/* ── Section 5: Editorial curadoria ── */}
      <section className="page-s5" style={{ marginBottom: 48 }}>
        <FeaturedProjects />
      </section>
    </AppLayout>
  );
}
