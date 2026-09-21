import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Calendar, Filter, ChevronDown, 
  ArrowRight, ShieldCheck, Clock, Map
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ===================================================
   MOCKS
=================================================== */
const TOP_MATCHES = [
  {
    id: 1, title: 'Ví da nam Pedro đen', location: 'Toà H1, ĐHBK Hà Nội',
    date: '18/09/2025', time: '14:30',
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
    img: 'https://images.unsplash.com/photo-1559591937-bea52fc059ba?w=400&q=80',
    status: 'found',
  }
];

const MORE_RESULTS = [
  {
    id: 4, title: 'Ví đen không rõ hiệu', location: 'Hồ Hoàn Kiếm',
    date: '10/09/2025', time: '20:00',
    matchScore: 58.2,
    img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=400&q=80',
    status: 'found',
  },
  {
    id: 5, title: 'Ví da cá sấu đen', location: 'Aeon Mall Hà Đông',
    date: '18/09/2025', time: '19:45',
    matchScore: 55.4,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    status: 'found',
  },
];

/* ===================================================
   COMPONENTS
=================================================== */
function MatchCard({ item, isTopMatch = false }) {
  return (
    <div 
      className="card animate-fadeInUp"
      style={{ 
        display: 'flex', flexDirection: 'column',
        border: '1px solid var(--border)',
        overflow: 'hidden', position: 'relative'
      }}
    >
      <div style={{ position: 'relative', paddingTop: '65%' }}>
        <img 
          src={item.img} 
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Gradient overlay for text readability if needed */}
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

        <div style={{ marginTop: 'auto' }}>
          <Link to={`/chi-tiet/${item.id}`} className="btn btn-ghost btn-full">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ── HEADER / SEARCH BAR ── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '24px 0', position: 'sticky', top: 60, zIndex: 100 }}>
        <div className="container">
          <div className="search-bar" style={{ maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '0 20px', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khoá đồ thất lạc..."
              style={{ fontSize: '1rem' }}
            />
            <div className="search-divider" />
            <button className="search-category" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              Tất cả danh mục <ChevronDown size={14} />
            </button>
            <button className="search-btn" style={{ padding: '12px 24px', fontSize: '0.9375rem' }}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <main className="container" style={{ flex: 1, padding: '40px var(--space-6)', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        
        {/* ── SIDEBAR FILTERS ── */}
        <aside>
          <div style={{ 
            background: 'white', borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border)', padding: '24px',
            position: 'sticky', top: 180
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: 700, fontSize: '1.0625rem' }}>
              <Filter size={18} />
              Bộ lọc nâng cao
            </div>

            {/* Time Filter */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} className="text-muted" /> Thời gian
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="checkbox-wrap">
                  <input type="radio" name="time" defaultChecked /> Bất kỳ lúc nào
                </label>
                <label className="checkbox-wrap">
                  <input type="radio" name="time" /> 24 giờ qua
                </label>
                <label className="checkbox-wrap">
                  <input type="radio" name="time" /> 7 ngày qua
                </label>
                <label className="checkbox-wrap">
                  <input type="radio" name="time" /> Tuỳ chỉnh...
                </label>
              </div>
            </div>

            <div className="divider" style={{ margin: '20px 0' }}></div>

            {/* Location Filter */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Map size={14} className="text-muted" /> Khu vực
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="checkbox-wrap">
                  <input type="checkbox" defaultChecked /> Hà Nội
                </label>
                <label className="checkbox-wrap">
                  <input type="checkbox" /> TP. Hồ Chí Minh
                </label>
                <label className="checkbox-wrap">
                  <input type="checkbox" /> Khác
                </label>
              </div>
            </div>

            <button className="btn btn-outline-white btn-full" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}>
              Áp dụng bộ lọc
            </button>
          </div>
        </aside>

        {/* ── RESULTS AREA ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 className="text-heading">Kết quả tìm kiếm cho "{query}"</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {TOP_MATCHES.length + MORE_RESULTS.length} kết quả
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {TOP_MATCHES.map((item, i) => (
              <div key={item.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <MatchCard item={item} />
              </div>
            ))}
            {MORE_RESULTS.map((item, i) => (
              <div key={item.id} style={{ animationDelay: `${(i + 3) * 0.1}s` }}>
                <MatchCard item={item} />
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
