import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, AlertTriangle, ChevronRight, 
  ShieldCheck, Share2, Flag, User, Info, CheckCircle, Image as ImageIcon, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ===================================================
   MOCKS
=================================================== */
const ITEM = {
  id: '1',
  title: 'Ví da nam Pedro màu đen',
  type: 'found', // 'lost' | 'found'
  category: 'Ví & Giấy tờ',
  date: '18/09/2025',
  time: '14:30',
  location: 'Toà H1, Đại học Bách Khoa Hà Nội',
  lat: 21.0041, lng: 105.8437,
  description: 'Nhặt được một ví da nam hiệu Pedro màu đen trên ghế đá gần sảnh Toà H1. Trong ví có một số giấy tờ tuỳ thân nhưng không tiện công khai. Mong chủ nhân liên hệ để nhận lại.',
  characteristics: [
    'Màu sắc: Đen',
    'Thương hiệu: Pedro',
    'Chất liệu: Da thật',
    'Đặc điểm phụ: Có vết xước nhỏ ở góc phải dưới'
  ],
  finder: {
    name: 'Thành viên uy tín',
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TV&backgroundColor=1e6b6b'
  },
  images: [
    'https://images.unsplash.com/photo-1627123424574-724758594913?w=800&q=80',
    'https://images.unsplash.com/photo-1605333396914-232f50c05b8a?w=800&q=80'
  ],
  matchData: {
    score: 94.5,
    visual: 98, location: 90, time: 92
  }
};

/* ===================================================
   COMPONENTS
=================================================== */
export default function ItemDetailPage() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, background: 'var(--bg-canvas)' }}>
        {/* ── BREADCRUMB ── */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
              <ChevronRight size={14} />
              <Link to="/tim-kiem" style={{ color: 'inherit', textDecoration: 'none' }}>Tìm kiếm</Link>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ITEM.title}</span>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px var(--space-6)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
          
          {/* ── LEFT COLUMN: GALLERY & MATCH DATA ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Gallery */}
            <div style={{ 
              background: 'white', padding: '16px', borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Main Image */}
              <div style={{ 
                aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', 
                marginBottom: '16px', position: 'relative' 
              }}>
                <img 
                  src={ITEM.images[activeImage]} 
                  alt={ITEM.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                  <span className={`badge ${ITEM.type === 'lost' ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.8125rem', padding: '6px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {ITEM.type === 'lost' ? 'Cần tìm đồ thất lạc' : 'Đồ nhặt được'}
                  </span>
                </div>
              </div>
              
              {/* Thumbnails */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {ITEM.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                      border: activeImage === i ? '2px solid var(--accent)' : '2px solid transparent',
                      padding: 0, cursor: 'pointer', transition: 'all 200ms',
                      opacity: activeImage === i ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt={`Thumb ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Match Breakdown (Only show if there is match data) */}
            {ITEM.matchData && (
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.1) 100%)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-2xl)', padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '50%', background: 'var(--status-found)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                  }}>
                    {ITEM.matchData.score}%
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>
                      Độ tương đồng cao
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Hệ thống AI đánh giá vật phẩm này có khả năng cao là của bạn.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 120, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={14} /> Ngoại hình
                    </div>
                    <div style={{ flex: 1, height: 6, background: 'rgba(16,185,129,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${ITEM.matchData.visual}%`, height: '100%', background: 'var(--status-found)', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: 'var(--status-found)' }}>
                      {ITEM.matchData.visual}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 120, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} /> Địa điểm
                    </div>
                    <div style={{ flex: 1, height: 6, background: 'rgba(16,185,129,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${ITEM.matchData.location}%`, height: '100%', background: 'var(--status-found)', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: 'var(--status-found)' }}>
                      {ITEM.matchData.location}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 120, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> Thời gian
                    </div>
                    <div style={{ flex: 1, height: 6, background: 'rgba(16,185,129,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${ITEM.matchData.time}%`, height: '100%', background: 'var(--status-found)', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: 'var(--status-found)' }}>
                      {ITEM.matchData.time}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: DETAILS & ACTIONS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header Info */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span className="badge badge-accent">{ITEM.category}</span>
                <span className="badge" style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>ID: #{ITEM.id}</span>
              </div>
              <h1 className="text-display-md" style={{ marginBottom: '20px' }}>{ITEM.title}</h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Địa điểm</div>
                    <div style={{ fontSize: '0.9375rem' }}>{ITEM.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Clock size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Thời gian</div>
                    <div style={{ fontSize: '0.9375rem' }}>{ITEM.time} ngày {ITEM.date}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Finder Info */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', background: 'white', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={ITEM.finder.avatar} 
                  alt="Finder"
                  style={{ width: 44, height: 44, borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Người đăng tin
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{ITEM.finder.name}</span>
                    {ITEM.finder.verified && <CheckCircle size={14} style={{ color: 'var(--status-found)' }} />}
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Xem hồ sơ</button>
            </div>

            {/* Description & Characteristics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Mô tả chi tiết</h3>
                <p className="text-body" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {ITEM.description}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Đặc điểm nhận dạng</h3>
                <ul style={{ 
                  listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px',
                  color: 'var(--text-secondary)', fontSize: '0.9375rem'
                }}>
                  {ITEM.characteristics.map((char, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 8, flexShrink: 0 }} />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Area */}
            <div style={{ 
              marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              <Link 
                to={`/xac-minh/${ITEM.id}`}
                className="btn btn-primary btn-full btn-lg" 
                style={{ 
                  background: ITEM.type === 'found' ? 'var(--accent)' : 'var(--status-found)',
                  boxShadow: 'var(--shadow-md)',
                  textDecoration: 'none'
                }}
              >
                {ITEM.type === 'found' ? 'Xác minh quyền sở hữu (Claim)' : 'Tôi đã nhặt được đồ này'}
                <ArrowRight size={18} />
              </Link>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button className="btn btn-ghost btn-full" style={{ gap: '8px' }}>
                  <Share2 size={16} /> Chia sẻ
                </button>
                <button className="btn btn-ghost btn-full" style={{ gap: '8px', color: 'var(--status-lost)' }}>
                  <Flag size={16} /> Báo cáo
                </button>
              </div>

              {/* Security Hint */}
              <div style={{ 
                display: 'flex', alignItems: 'flex-start', gap: '10px', 
                padding: '16px', background: 'rgba(245,158,11,0.05)', 
                borderRadius: 'var(--radius-lg)', marginTop: '8px'
              }}>
                <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8125rem', color: '#b45309', lineHeight: 1.5 }}>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Lưu ý an toàn:</strong>
                  Tuyệt đối không chuyển tiền cọc hoặc phí chuộc đồ. Quá trình trao đổi cần thực hiện trực tiếp tại nơi an toàn.
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
