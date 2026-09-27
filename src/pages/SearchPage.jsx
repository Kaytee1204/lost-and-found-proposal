import { useState, useEffect } from 'react';
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
    category: 'Ví & Giấy tờ',
    date: '18/09/2025', time: '14:30',
    matchScore: 94.5,
    matchBreakdown: { visual: 98, location: 90, time: 92 },
    img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=400&q=80',
    status: 'found',
  },
  {
    id: 2, title: 'Ví nam Pedro viền nâu', location: 'Tuyến bus 32, Cầu Giấy',
    category: 'Ví & Giấy tờ',
    date: '17/09/2025', time: '08:15',
    matchScore: 82.1,
    matchBreakdown: { visual: 85, location: 60, time: 90 },
    img: 'https://images.unsplash.com/photo-1605333396914-232f50c05b8a?w=400&q=80',
    status: 'found',
  },
  {
    id: 3, title: 'Bóp da đen nam', location: 'Khu A, ĐH Kinh tế Quốc dân',
    category: 'Ví & Giấy tờ',
    date: '16/09/2025', time: '17:00',
    img: 'https://images.unsplash.com/photo-1559591937-bea52fc059ba?w=400&q=80',
    status: 'found',
  }
];

const MORE_RESULTS = [
  {
    id: 4, title: 'Ví đen không rõ hiệu', location: 'Hồ Hoàn Kiếm',
    category: 'Ví & Giấy tờ',
    date: '10/09/2025', time: '20:00',
    matchScore: 58.2,
    img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=400&q=80',
    status: 'found',
  },
  {
    id: 5, title: 'Ví da cá sấu đen', location: 'Aeon Mall Hà Đông',
    category: 'Ví & Giấy tờ',
    date: '18/09/2025', time: '19:45',
    matchScore: 55.4,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    status: 'found',
  },
  {
    id: 6, title: 'iPhone 15 Pro Titan', location: 'Tuyến bus 32, Cầu Giấy',
    category: 'Thiết bị điện tử',
    date: '19/09/2025', time: '10:15',
    matchScore: 89.0,
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    status: 'lost',
  },
  {
    id: 7, title: 'Chìa khóa smartkey Honda', location: 'Vinhomes Central Park, TP.HCM',
    category: 'Chìa khóa',
    date: '18/09/2025', time: '15:20',
    matchScore: 78.5,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    status: 'found',
  },
  {
    id: 8, title: 'Mèo Anh lông ngắn xám', location: 'KĐT Sala, TP. Thủ Đức',
    category: 'Thú cưng',
    date: '17/09/2025', time: '09:00',
    matchScore: 72.0,
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    status: 'lost',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'Tất cả danh mục' },
  { value: 'Ví & Giấy tờ', label: 'Ví & Giấy tờ' },
  { value: 'Thiết bị điện tử', label: 'Thiết bị điện tử' },
  { value: 'Chìa khóa', label: 'Chìa khóa' },
  { value: 'Thú cưng', label: 'Thú cưng' },
  { value: 'Khác', label: 'Khác' },
];

/* ===================================================
   COMPONENTS
=================================================== */
function MatchCard({ item, isTopMatch = false }) {
  const isFound = item.status === 'found';
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
          <span className={`badge ${isFound ? 'badge-found' : 'badge-lost'}`}>
            {isFound ? 'Nhặt được' : 'Cần tìm'}
          </span>
          <span className="badge badge-accent">{item.category || 'Ví & Giấy tờ'}</span>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('cat') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeSearch, setActiveSearch] = useState({ q: initialQuery, cat: initialCategory });

  // Sync if URL search params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || 'all';
    setQuery(q);
    setSelectedCategory(cat);
    setActiveSearch({ q, cat });
  }, [searchParams]);

  // Handle Search Submission
  const handleSearch = (e) => {
    e?.preventDefault();
    const newParams = {};
    if (query.trim()) newParams.q = query.trim();
    if (selectedCategory && selectedCategory !== 'all') newParams.cat = selectedCategory;
    setSearchParams(newParams);
    setActiveSearch({ q: query.trim(), cat: selectedCategory });
  };

  // Filter items based on active search
  const filterItem = (item) => {
    const keyword = activeSearch.q.toLowerCase().trim();
    const matchesQ = !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword);
    const matchesCat = activeSearch.cat === 'all' || item.category === activeSearch.cat;
    return matchesQ && matchesCat;
  };

  const filteredTopMatches = TOP_MATCHES.filter(filterItem);
  const filteredMoreResults = MORE_RESULTS.filter(filterItem);
  const totalResults = filteredTopMatches.length + filteredMoreResults.length;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ── HEADER / SEARCH BAR (Đồng tông với Navbar, ghim ngay dưới Navbar) ── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 0',
        position: 'sticky',
        top: '64px',
        zIndex: 40,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="container">
          <form
            onSubmit={handleSearch}
            className="search-bar"
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              background: 'white',
              border: '1.5px solid var(--border-strong)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Search Icon */}
            <Search size={18} style={{ color: 'var(--teal-600)', marginLeft: '18px', flexShrink: 0 }} />

            {/* Search Input */}
            <input
              type="text"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khoá đồ thất lạc (vd: Ví Pedro, iPhone, CCCD...)"
              style={{ fontSize: '0.95rem' }}
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0 8px', cursor: 'pointer', fontSize: '0.85rem' }}
                title="Xóa từ khóa"
              >
                ✕
              </button>
            )}

            <div className="search-divider" />

            {/* Functional Category Select */}
            <select
              className="search-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                padding: '0 12px'
              }}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Functional Submit Button matching Navbar Teal Tone */}
            <button
              type="submit"
              className="search-btn"
              style={{
                background: 'var(--teal-600)',
                color: 'white',
                border: 'none',
                padding: '10px 22px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: 'var(--radius-lg)',
                transition: 'background 150ms ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-700)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--teal-600)'}
            >
              <Search size={14} />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </div>

      <main className="container" style={{ flex: 1, padding: '40px var(--space-6)', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>

        {/* ── SIDEBAR FILTERS ── */}
        <aside>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)', padding: '24px',
            position: 'sticky', top: 160
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
            <h2 className="text-heading" style={{ margin: 0 }}>
              {activeSearch.q ? `Kết quả tìm kiếm cho "${activeSearch.q}"` : 'Tất cả kết quả tìm kiếm'}
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {totalResults} kết quả
            </div>
          </div>

          {totalResults > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredTopMatches.map((item, i) => (
                <div key={item.id} style={{ animationDelay: `${i * 0.1}s` }}>
                  <MatchCard item={item} isTopMatch={true} />
                </div>
              ))}
              {filteredMoreResults.map((item, i) => (
                <div key={item.id} style={{ animationDelay: `${(i + 3) * 0.1}s` }}>
                  <MatchCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: 'var(--radius-xl)', padding: '48px 24px',
              textAlign: 'center', border: '1px solid var(--border)', color: 'var(--text-muted)'
            }}>
              <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Không tìm thấy kết quả nào
              </h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Không có vật phẩm nào khớp với từ khóa "{activeSearch.q}". Thử tìm với từ khóa khác hoặc chọn "Tất cả danh mục".
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
