import { useState, useMemo } from 'react';
import { Search, MapPin, Eye, Trash2, X, CheckCircle, RotateCcw, Filter, Phone, Calendar, Tag } from 'lucide-react';
import { INITIAL_ITEMS } from './mockData';

export default function AdminItemsPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', payload: null, title: '', placeholder: '' });
  const [actionReason, setActionReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const executeAction = () => {
    if (!actionReason.trim()) {
      showToast('Vui lòng nhập lý do thực hiện');
      return;
    }

    const { type, payload } = actionModal;

    if (type === 'HIDE_ITEM') {
      setItems(prev => prev.map(item => item.id === payload ? { ...item, status: 'hidden' } : item));
      showToast(`Đã gỡ bài đăng ${payload}`);
      if (selectedItemDetail?.id === payload) {
        setSelectedItemDetail(prev => ({ ...prev, status: 'hidden' }));
      }
    } else if (type === 'RESTORE_ITEM') {
      setItems(prev => prev.map(item => item.id === payload ? { ...item, status: 'active' } : item));
      showToast(`Đã khôi phục bài đăng ${payload}`);
      if (selectedItemDetail?.id === payload) {
        setSelectedItemDetail(prev => ({ ...prev, status: 'active' }));
      }
    }

    setActionModal({ isOpen: false, type: '', payload: null, title: '', placeholder: '' });
    setActionReason('');
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        item.title.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.reporter && item.reporter.toLowerCase().includes(query)) ||
        (item.reporterPhone && item.reporterPhone.includes(query));

      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesLocation = filterLocation === 'all' || item.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

      return matchesSearch && matchesType && matchesLocation && matchesStatus;
    });
  }, [items, searchQuery, filterType, filterLocation, filterStatus]);

  const hasActiveFilters = searchQuery || filterType !== 'all' || filterLocation !== 'all' || filterStatus !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterLocation('all');
    setFilterStatus('all');
  };

  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const hiddenCount = items.filter(i => i.status === 'hidden').length;
  const resolvedCount = items.filter(i => i.status === 'resolved').length;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '70px', right: '28px', zIndex: 100,
          background: '#090d12', color: 'white', padding: '10px 16px',
          borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <CheckCircle size={16} style={{ color: '#2dd4bf' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── UNIFIED WORKBENCH ── */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Quản lý tin đăng
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(30,107,107,0.08)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: '12px' }}>
                {filteredItems.length} tin hiển thị
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Kiểm duyệt nội dung, xử lý tin vi phạm và theo dõi trạng thái đồ thất lạc
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: '#dc2626' }}>{lostCount} Cần tìm</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: '#059669' }}>{foundCount} Nhặt được</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: '#6366f1' }}>{resolvedCount} Đã trao trả</span>
          </div>
        </div>

        {/* Toolbar: Category Tabs & Filters */}
        <div style={{
          padding: '14px 24px', background: '#fafbfc', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          {/* Row 1: Fast Type Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tất cả tin', count: items.length },
                { id: 'lost', label: 'Cần tìm đồ', count: lostCount },
                { id: 'found', label: 'Nhặt được', count: foundCount },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                    border: filterType === tab.id ? '1px solid var(--teal-600)' : '1px solid transparent',
                    background: filterType === tab.id ? 'white' : 'transparent',
                    color: filterType === tab.id ? 'var(--teal-700)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 120ms'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px',
                    background: filterType === tab.id ? 'var(--teal-50)' : 'rgba(0,0,0,0.04)',
                    color: filterType === tab.id ? 'var(--teal-700)' : 'var(--text-muted)'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'none', border: 'none', color: 'var(--teal-700)',
                  fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} />
                <span>Đặt lại lọc</span>
              </button>
            )}
          </div>

          {/* Row 2: Search + Select Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{
              flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '8px',
              background: 'white', padding: '7px 12px', borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.12)'
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm theo tên đồ, mã ID, người đăng, SĐT..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.825rem', fontFamily: 'var(--font-body)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', padding: '0 2px' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Select */}
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              style={{
                padding: '7px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.8rem', background: 'white', color: 'var(--text-secondary)',
                outline: 'none', cursor: 'pointer', minWidth: '140px'
              }}
            >
              <option value="all">Mọi địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP. Hồ Chí Minh</option>
            </select>

            {/* Status Select */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '7px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.8rem', background: 'white', color: 'var(--text-secondary)',
                outline: 'none', cursor: 'pointer', minWidth: '140px'
              }}
            >
              <option value="all">Mọi trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="matched">Đã khớp AI</option>
              <option value="resolved">Đã trao trả</option>
              <option value="hidden">Đã bị ẩn ({hiddenCount})</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vật phẩm</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phân loại</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Người đăng</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Khu vực &amp; Thời gian</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trạng thái</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr
                key={item.id}
                onClick={() => setSelectedItemDetail(item)}
                style={{
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  background: item.status === 'hidden' ? '#fffbfb' : 'white',
                  cursor: 'pointer',
                  transition: 'background 120ms'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.status === 'hidden' ? '#fff1f2' : '#f8fafc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = item.status === 'hidden' ? '#fffbfb' : 'white';
                }}
              >
                {/* Item Thumbnail & Info */}
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: '42px', height: '42px', borderRadius: '8px',
                        objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
                          {item.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          · {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Type Badge */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                    background: item.type === 'lost' ? '#fef2f2' : 'rgba(45,212,191,0.12)',
                    color: item.type === 'lost' ? '#dc2626' : 'var(--teal-700)'
                  }}>
                    {item.type === 'lost' ? 'Cần tìm' : 'Nhặt được'}
                  </span>
                </td>

                {/* Poster Info (Unmasked phone) */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.825rem' }}>
                    {item.reporter}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                    <Phone size={11} /> {item.reporterPhone}
                  </div>
                </td>

                {/* Location & Time */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontSize: '0.825rem' }}>
                    <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                      {item.location}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px', paddingLeft: '16px' }}>
                    {item.date}
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                    background:
                      item.status === 'hidden' ? '#fef2f2' :
                        item.status === 'resolved' ? '#eef2ff' :
                          item.status === 'matched' ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
                    color:
                      item.status === 'hidden' ? '#dc2626' :
                        item.status === 'resolved' ? '#6366f1' :
                          item.status === 'matched' ? '#059669' : '#059669'
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: item.status === 'hidden' ? '#dc2626' : item.status === 'resolved' ? '#6366f1' : '#10b981'
                    }} />
                    {item.status === 'hidden' ? 'Bị ẩn' :
                      item.status === 'resolved' ? 'Đã trao trả' :
                        item.status === 'matched' ? 'Khớp AI' : 'Đang tìm'}
                  </span>
                </td>

                {/* Action Buttons (Direct action only, click row to view) */}
                <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                    {item.status !== 'hidden' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionModal({ isOpen: true, type: 'HIDE_ITEM', payload: item.id, title: 'Gỡ bài đăng vi phạm', placeholder: 'Nhập lý do gỡ bài này...' });
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '5px 10px', borderRadius: '6px', border: '1px solid #fecaca',
                          background: '#fffbfb', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                        }}
                        title="Gỡ tin vi phạm"
                      >
                        <Trash2 size={13} />
                        <span>Gỡ bài</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionModal({ isOpen: true, type: 'RESTORE_ITEM', payload: item.id, title: 'Khôi phục bài đăng', placeholder: 'Nhập lý do khôi phục...' });
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '5px 10px', borderRadius: '6px', border: '1px solid #a7f3d0',
                          background: '#ecfdf5', color: '#059669', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                        }}
                        title="Khôi phục tin"
                      >
                        <RotateCcw size={13} />
                        <span>Hiện lại</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  Không tìm thấy tin đăng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedItemDetail && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '12px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)'
          }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--teal-700)', fontFamily: 'var(--font-mono)' }}>{selectedItemDetail.id}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {selectedItemDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <img
                src={selectedItemDetail.img}
                alt={selectedItemDetail.title}
                style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '8px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Người đăng</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>{selectedItemDetail.reporter}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--teal-700)', marginTop: '2px', fontWeight: 600 }}>
                    SĐT: {selectedItemDetail.reporterPhone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Địa điểm &amp; Thời gian</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>{selectedItemDetail.location}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedItemDetail.date}</div>
                </div>
              </div>

              {selectedItemDetail.aiScore && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', fontSize: '0.825rem', fontWeight: 600 }}>
                  <CheckCircle size={15} /> Độ khớp tìm kiếm: {selectedItemDetail.aiScore}%
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Nội dung mô tả:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.04)', margin: 0 }}>
                  {selectedItemDetail.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {selectedItemDetail.status !== 'hidden' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemDetail(null);
                      setActionModal({ isOpen: true, type: 'HIDE_ITEM', payload: selectedItemDetail.id, title: 'Gỡ bài đăng vi phạm', placeholder: 'Nhập lý do gỡ bài...' });
                    }}
                    style={{ padding: '8px 16px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Gỡ bài vi phạm
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemDetail(null);
                      setActionModal({ isOpen: true, type: 'RESTORE_ITEM', payload: selectedItemDetail.id, title: 'Khôi phục bài đăng', placeholder: 'Nhập lý do khôi phục...' });
                    }}
                    style={{ padding: '8px 16px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Khôi phục bài
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedItemDetail(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTION REASON MODAL ── */}
      {actionModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-primary)' }}>
              {actionModal.title}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Lý do thực hiện <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder={actionModal.placeholder}
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, type: '', payload: null, title: '', placeholder: '' })}
                style={{ padding: '8px 14px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid rgba(0,0,0,0.06)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={executeAction}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  background: actionModal.type === 'HIDE_ITEM' ? '#dc2626' : 'var(--teal-600)', color: 'white'
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
