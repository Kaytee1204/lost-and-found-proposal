import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, AlertTriangle, Package, Users, ShieldAlert, ArrowUpRight, ArrowRight } from 'lucide-react';
import { MOCK_STATS, INITIAL_REPORTS, INITIAL_ITEMS } from './mockData';

export default function AdminOverviewPage() {
  const [reports] = useState(INITIAL_REPORTS);
  const [items] = useState(INITIAL_ITEMS);
  const navigate = useNavigate();

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Tổng tin đăng', value: '1,842', change: '+12.5%', isUp: true },
          { label: 'Đã trao trả thành công', value: '1,420', change: '+18.2%', isUp: true },
          { label: 'Báo cáo vi phạm', value: `${reports.length}`, sub: `${pendingReports.length} chờ xử lý`, isWarning: pendingReports.length > 0 },
          { label: 'Tài khoản tạm khóa', value: '24', change: '+2 tuần này', isUp: false },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '10px',
            padding: '16px 20px', border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700,
                color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1
              }}>
                {stat.value}
              </span>
              {stat.change && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: stat.isUp ? '#059669' : '#64748b',
                  background: stat.isUp ? '#ecfdf5' : '#f1f5f9',
                  padding: '2px 6px', borderRadius: '4px'
                }}>
                  {stat.change}
                </span>
              )}
              {stat.sub && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: stat.isWarning ? '#dc2626' : '#64748b',
                  background: stat.isWarning ? '#fef2f2' : '#f1f5f9',
                  padding: '2px 6px', borderRadius: '4px'
                }}>
                  {stat.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. WORKSPACE 2 CỘT CÂN ĐỐI (50% - 50%, KHÔNG BỊ CO NÉN CHỮ) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* CỘT TRÁI: KHIẾU NẠI & VI PHẠM CẦN XỬ LÝ */}
        <div style={{
          background: 'white', borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}>
          {/* Header box */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Khiếu nại chờ xử lý ({pendingReports.length})
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/reports')}
              style={{
                background: 'none', border: 'none', color: 'var(--teal-700)',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '2px'
              }}
            >
              Xem tất cả <ChevronRight size={13} />
            </button>
          </div>

          {/* List items */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pendingReports.map((report, idx) => (
              <div
                key={report.id}
                onClick={() => navigate(`/admin/reports?id=${report.id}`)}
                style={{
                  padding: '14px 18px',
                  borderBottom: idx < pendingReports.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
                  cursor: 'pointer', transition: 'background 120ms'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                      padding: '1px 5px', borderRadius: '3px',
                      background: '#fef2f2', color: '#dc2626'
                    }}>
                      {report.typeLabel}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {report.id}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      · {report.time}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)',
                    lineHeight: 1.4, margin: '2px 0 4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    "{report.reason}"
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bị tố cáo: <strong style={{ color: '#be123c' }}>{report.reportedUser}</strong> ({report.reportedUserPhone})
                  </div>
                </div>

                <div style={{
                  padding: '5px 8px', borderRadius: '5px',
                  background: 'rgba(30,107,107,0.06)', color: 'var(--teal-700)',
                  fontSize: '0.725rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0
                }}>
                  <span>Chi tiết</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            ))}

            {pendingReports.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                <CheckCircle2 size={20} style={{ color: '#10b981', margin: '0 auto 6px' }} />
                Tất cả khiếu nại đã được giải quyết
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TIN ĐĂNG MỚI NHẤT */}
        <div style={{
          background: 'white', borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}>
          {/* Header box */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={15} style={{ color: 'var(--teal-600)' }} />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Tin đăng gần đây
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/items')}
              style={{
                background: 'none', border: 'none', color: 'var(--teal-700)',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '2px'
              }}
            >
              Xem tất cả <ChevronRight size={13} />
            </button>
          </div>

          {/* List items */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => navigate('/admin/items')}
                style={{
                  padding: '12px 18px',
                  borderBottom: idx < recentItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                  cursor: 'pointer', transition: 'background 120ms'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {item.location} · {item.reporter}
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.675rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', flexShrink: 0,
                  background: item.type === 'lost' ? '#fef2f2' : 'rgba(45,212,191,0.12)',
                  color: item.type === 'lost' ? '#dc2626' : 'var(--teal-700)'
                }}>
                  {item.type === 'lost' ? 'Tìm đồ' : 'Nhặt đồ'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
