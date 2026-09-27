import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Activity, AlertCircle, FileText, Shield, User, Ban, CheckCircle2, Phone, Calendar, Mail, Check } from 'lucide-react';
import { USERS_LIST } from './mockData';

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewTab, setViewTab] = useState('overview');

  useEffect(() => {
    const foundUser = USERS_LIST.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [id]);

  if (!user) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang tải dữ liệu hoặc không tìm thấy thành viên...</p>
        <button onClick={() => navigate('/admin/users')} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── BREADCRUMB & BACK LINK ── */}
      <div>
        <Link
          to="/admin/users"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.825rem',
            fontWeight: 500, marginBottom: '14px'
          }}
        >
          <ArrowLeft size={14} /> Quay lại danh sách tài khoản
        </Link>

        {/* User Profile Header Card */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '20px 24px',
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '10px',
              background: user.role === 'Admin' ? '#f3e8ff' : '#0d2b2b',
              color: user.role === 'Admin' ? '#7e22ce' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, flexShrink: 0
            }}>
              {user.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {user.name}
                </h1>
                <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                  {user.id}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {user.email}</span>
                <span>•</span>
                <span style={{ color: user.status === 'Hoạt động' ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {user.status === 'Hoạt động' ? 'Đang hoạt động' : 'Đã tạm khóa'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => alert(`Đã gửi thông báo cảnh báo đến ${user.email}`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)',
                background: 'white', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Gửi thông báo
            </button>
            <button
              onClick={() => alert(`Thao tác khóa/mở khóa tài khoản ${user.id}`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '6px', border: 'none',
                background: user.status === 'Hoạt động' ? '#dc2626' : 'var(--teal-600)',
                color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Ban size={14} />
              <span>{user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── WORKBENCH TABS & CONTENT ── */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Tabs Bar */}
        <div style={{
          padding: '0 20px', background: '#fafbfc', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', gap: '4px'
        }}>
          {[
            { id: 'overview', label: 'Hồ sơ & Uy tín' },
            { id: 'history', label: 'Lịch sử đăng tin (5)' },
            { id: 'reports', label: 'Lịch sử vi phạm (1)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id)}
              style={{
                padding: '12px 18px', background: 'none', border: 'none',
                borderBottom: `2px solid ${viewTab === tab.id ? 'var(--teal-600)' : 'transparent'}`,
                color: viewTab === tab.id ? 'var(--teal-700)' : 'var(--text-secondary)',
                fontWeight: viewTab === tab.id ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer',
                marginBottom: '-1px', transition: 'all 120ms'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {viewTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Role & Verification */}
              <div style={{ padding: '18px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', background: '#fafbfc' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Vai trò phân quyền
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
                    background: user.role === 'Admin' ? '#f3e8ff' : 'rgba(30,107,107,0.1)',
                    color: user.role === 'Admin' ? '#7e22ce' : 'var(--teal-700)'
                  }}>
                    {user.role === 'Admin' ? <Shield size={13} /> : <User size={13} />}
                    {user.role}
                  </span>
                  {user.verified && (
                    <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>
                      Đã xác thực CCCD
                    </span>
                  )}
                </div>
              </div>

              {/* Trust Score */}
              <div style={{ padding: '18px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', background: '#fafbfc' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Điểm uy tín hệ thống
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
                    color: user.trustScore > 80 ? '#059669' : user.trustScore > 50 ? '#d97706' : '#dc2626',
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums'
                  }}>
                    {user.trustScore}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
                  <div style={{ width: `${user.trustScore}%`, height: '100%', background: user.trustScore > 80 ? '#10b981' : '#f59e0b' }} />
                </div>
              </div>

              {/* Success Count */}
              <div style={{ padding: '18px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', background: '#fafbfc' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Số lần trao trả thành công
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                  {user.returnsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Đã được chủ sở hữu đánh giá 5 sao
                </div>
              </div>
            </div>
          )}

          {viewTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px', padding: '14px 0',
                  borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.05)' : 'none', alignItems: 'center'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <FileText size={18} color="var(--teal-600)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {i % 2 === 0 ? 'Nhặt được ví da nam màu đen' : 'Tìm chìa khóa xe máy Honda'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{i + 1} tuần trước</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Khu vực: {i % 2 === 0 ? 'Đại học Bách Khoa, Hai Bà Trưng' : 'Quanh Hồ Hoàn Kiếm, Hà Nội'}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                    background: '#ecfdf5', color: '#059669'
                  }}>
                    Đã hoàn thành
                  </span>
                </div>
              ))}
            </div>
          )}

          {viewTab === 'reports' && (
            <div style={{
              display: 'flex', gap: '14px', padding: '16px',
              border: '1px solid #fecdd3', background: '#fff1f2', borderRadius: '8px'
            }}>
              <AlertCircle size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#be123c' }}>
                    Tố cáo mạo nhận chủ sở hữu (REP-701)
                  </span>
                  <span style={{ fontSize: '0.725rem', color: '#e11d48' }}>· 1 tháng trước</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '0.825rem', color: '#9f1239', lineHeight: 1.5 }}>
                  Cố tình trả lời sai câu hỏi bí mật nhiều lần và spam tin nhắn yêu cầu giao máy tính MacBook. Tài khoản này đã gửi 4 yêu cầu claim liên tiếp trong vòng 1 giờ cho cùng 1 bài đăng.
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#be123c', background: 'rgba(255,255,255,0.7)', padding: '6px 10px', borderRadius: '6px' }}>
                  Biện pháp xử lý của Admin: Khóa tạm thời 3 ngày và trừ 30 điểm uy tín.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
