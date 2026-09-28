import { useState } from 'react';
import { MOCK_STATS, INITIAL_REPORTS, INITIAL_ITEMS } from './mockData';
import StatCards from '../components/overview/StatCards';
import PendingReportsList from '../components/overview/PendingReportsList';
import RecentItemsList from '../components/overview/RecentItemsList';

export default function AdminOverviewPage() {
  const [reports] = useState(INITIAL_REPORTS);
  const [items] = useState(INITIAL_ITEMS);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const recentItems = items.slice(0, 5);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }}>
      {/* ── 1. HEADER TINH GIẢN ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Bảng điều khiển
            </h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Tổng hợp dữ liệu tin đăng, khiếu nại và hoạt động theo thời gian thực
          </p>
        </div>
      </div>

      {/* ── 2. METRIC STATS ROW (4 CARD GỌN GÀNG) ── */}
      <StatCards 
        reports={reports} 
        items={items} 
        pendingReports={pendingReports} 
      />

      {/* ── 3. WORKSPACE 2 CỘT CÂN ĐỐI (50% - 50%, KHÔNG BỊ CO NÉN CHỮ) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* CỘT TRÁI: KHIẾU NẠI & VI PHẠM CẦN XỬ LÝ */}
        <PendingReportsList pendingReports={pendingReports} />

        {/* CỘT PHẢI: TIN ĐĂNG MỚI NHẤT */}
        <RecentItemsList recentItems={recentItems} />
      </div>
    </div>
  );
}
