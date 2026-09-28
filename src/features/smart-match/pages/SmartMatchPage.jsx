import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ShieldCheck, MapPin, Clock, Image as ImageIcon,
  CheckCircle, AlertTriangle
} from 'lucide-react';


/* ===================================================
   MOCKS
=================================================== */
const POSTED_ITEM = {
  id: 'REQ-8821',
  title: 'Ví da nam Pedro màu đen',
  type: 'lost',
  date: '18/09/2025',
  time: '14:30',
  location: 'Khu vực Bách Khoa, Hai Bà Trưng',
  img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=300&q=80',
};

const AI_MATCHES = [
  {
    id: 1, title: 'Ví da nam Pedro đen', location: 'Toà H1, ĐHBK Hà Nội',
    date: '18/09/2025', time: '15:10',
    matchScore: 94.5,
    matchBreakdown: { visual: 98, location: 90, time: 92 },
    img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=400&q=80',
    status: 'found',
  },
  {
    id: 2, title: 'Ví nam Pedro viền nâu', location: 'Tuyến bus 32, Cầu Giấy',
    date: '17/09/2025', time: '08:15',
    matchScore: 82.1,
    matchBreakdown: { visual: 85, location: 60, time: 90 },
    img: 'https://images.unsplash.com/photo-1605333396914-232f50c05b8a?w=400&q=80',
    status: 'found',
  },
  {
    id: 3, title: 'Bóp da đen nam', location: 'Khu A, ĐH Kinh tế Quốc dân',
    date: '16/09/2025', time: '17:00',
    matchScore: 76.8,
    matchBreakdown: { visual: 70, location: 80, time: 75 },
    img: 'https://images.unsplash.com/photo-1559591937-bea52fc059ba?w=400&q=80',
    status: 'found',
  }
];

/* ===================================================
   COMPONENTS
=================================================== */
function MatchCard({ item }) {
  return (
    <div
      className="card animate-fadeInUp"
      style={{
        display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(16,185,129,0.3)',
        overflow: 'hidden', position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 10,
        background: item.matchScore >= 80 ? 'var(--status-found)' : 'var(--status-warning)',
        color: 'white', fontWeight: 800, fontSize: '0.9375rem',
        padding: '6px 12px', borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', gap: '4px'
      }}>
        {item.matchScore}%
        <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.9 }}>Match</span>
      </div>

      <div style={{ position: 'relative', paddingTop: '65%' }}>
        <img
          src={item.img}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <span className="badge badge-found">Nhặt được</span>
          <span className="badge badge-accent">Ví & Giấy tờ</span>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {item.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
            {item.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
            {item.time} — {item.date}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)',
          padding: '12px', marginBottom: '20px', border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Chi tiết AI Match
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hình ảnh</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--status-found)' }}>{item.matchBreakdown.visual}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Địa điểm</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--status-warning)' }}>{item.matchBreakdown.location}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Thời gian</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--status-found)' }}>{item.matchBreakdown.time}%</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <Link to={`/chi-tiet/${item.id}`} className="btn btn-primary btn-full">
            Xem chi tiết & Xác minh
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SmartMatchPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>


      <main style={{ flex: 1, background: 'var(--bg-canvas)' }}>

        {/* ── SUCCESS HERO ── */}
        <div style={{ background: 'var(--accent)', color: 'white', padding: '60px 0 40px' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
            }}>
              <CheckCircle size={32} color="var(--status-found)" />
            </div>
            <h1 className="text-display-lg" style={{ marginBottom: '16px', color: 'white' }}>Đăng tin thành công!</h1>
            <p className="text-body" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 32px' }}>
              Tin tìm đồ của bạn đã được ghi nhận. Ngay lập tức, hệ thống AI Smart Match đã chạy ngầm và đối chiếu với hàng ngàn món đồ được nhặt trên hệ thống.
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'rgba(0,0,0,0.2)', padding: '16px 24px', borderRadius: 'var(--radius-xl)'
            }}>
              <img
                src={POSTED_ITEM.img}
                alt="My Item"
                style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tin vừa đăng
                </div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'white' }}>{POSTED_ITEM.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI MATCH RESULTS ── */}
        <div className="container" style={{ padding: '60px var(--space-6) 100px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <ShieldCheck size={28} style={{ color: 'var(--status-found)' }} />
            <div>
              <h2 className="text-heading" style={{ margin: 0 }}>Gợi ý thông minh (AI Matches)</h2>
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                Đã tìm thấy <strong style={{ color: 'var(--text-primary)' }}>{AI_MATCHES.length} kết quả</strong> có độ tương đồng trên 60%.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {AI_MATCHES.map((item, i) => (
              <div key={item.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <MatchCard item={item} />
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '60px', padding: '32px', background: 'white',
            borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: '20px'
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'var(--status-warning-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <AlertTriangle size={24} style={{ color: 'var(--status-warning)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Chưa thấy món đồ của bạn?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                Đừng lo lắng! Tin đăng của bạn vẫn đang hoạt động. Bất cứ khi nào có người đăng tin nhặt được một món đồ khớp với mô tả của bạn (tỉ lệ &gt; 60%), hệ thống sẽ tự động gửi thông báo (Notification/Email) ngay lập tức.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                Về trang chủ
              </button>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
