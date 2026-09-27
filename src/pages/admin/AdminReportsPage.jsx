import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ban, Check, AlertTriangle, CheckCircle2, Phone, ArrowLeft, ChevronRight, RotateCcw, ExternalLink } from 'lucide-react';
import { INITIAL_REPORTS } from './mockData';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [reportFilter, setReportFilter] = useState('pending');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [resolutionReason, setResolutionReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync with ?id= query param if present
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && reports.some(r => r.id === id)) {
      setSelectedReportId(id);
      const target = reports.find(r => r.id === id);
      if (target?.adminNote) {
        setResolutionReason(target.adminNote);
      }
    }
  }, [searchParams]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || null;
  }, [reports, selectedReportId]);

  const openReport = (report) => {
    setSelectedReportId(report.id);
    setResolutionReason(report.adminNote || '');
  };

  const closeReport = () => {
    setSelectedReportId(null);
    setResolutionReason('');
    if (searchParams.get('id')) {
      searchParams.delete('id');
      setSearchParams(searchParams);
    }
  };

  const handleAction = (actionType) => {
    if (!resolutionReason.trim()) {
      showToast('Vui lòng nhập lý do / căn cứ xử lý vào ô bên dưới');
      return;
    }

    if (actionType === 'DISMISS_REPORT') {
      setReports(prev => prev.map(r => r.id === selectedReportId ? { ...r, status: 'dismissed', adminNote: resolutionReason } : r));
      showToast(`Đã bác bỏ khiếu nại ${selectedReportId}`);
    } else if (actionType === 'RESOLVE_REPORT') {
      setReports(prev => prev.map(r => r.id === selectedReportId ? { ...r, status: 'resolved', adminNote: resolutionReason } : r));
      showToast(`Đã xử lý hồ sơ vi phạm ${selectedReportId}`);
    } else if (actionType === 'BAN_AND_RESOLVE') {
      setReports(prev => prev.map(r => r.id === selectedReportId ? { ...r, status: 'resolved', adminNote: resolutionReason } : r));
      showToast(`Đã khóa tài khoản vi phạm và giải quyết ca ${selectedReportId}`);
    }
  };

  const handleReopen = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'pending' } : r));
    showToast(`Đã mở lại hồ sơ ${id} để xử lý lại`);
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const dismissedCount = reports.filter(r => r.status === 'dismissed').length;

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (reportFilter === 'all') return true;
      if (reportFilter === 'pending') return r.status === 'pending';
      if (reportFilter === 'resolved') return r.status === 'resolved';
      if (reportFilter === 'dismissed') return r.status === 'dismissed';
      return r.reportType === reportFilter;
    });
  }, [reports, reportFilter]);

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '70px', right: '28px', zIndex: 100,
          background: '#090d12', color: 'white', padding: '10px 16px',
          borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <CheckCircle2 size={16} style={{ color: '#2dd4bf' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN CONTAINER ── */}
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
                Báo cáo vi phạm &amp; Khiếu nại
              </h2>
              {pendingCount > 0 ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '12px' }}>
                  {pendingCount} ca chờ xử lý
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '12px' }}>
                  Tất cả đã giải quyết
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Kiểm tra tố cáo mạo nhận tài sản, tống tiền hoặc tranh chấp quyền sở hữu đồ thất lạc
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: '#dc2626' }}>{pendingCount} Chờ xử lý</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: '#059669' }}>{resolvedCount} Đã xong</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{dismissedCount} Đã bác bỏ</span>
          </div>
        </div>

        {/* ── VIEW 1: CASE DETAIL VIEW (Có ô input riêng để nhập lý do trực tiếp, KHÔNG dùng popup) ── */}
        {selectedReport ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Detail Navigation Toolbar */}
            <div style={{
              padding: '12px 24px', background: '#fafbfc', borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
            }}>
              <button
                type="button"
                onClick={closeReport}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)',
                  background: 'white', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 120ms'
                }}
              >
                <ArrowLeft size={14} />
                <span>Quay lại danh sách khiếu nại</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--teal-700)', background: 'rgba(30,107,107,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedReport.id}
                </span>

                <span style={{
                  fontSize: '0.725rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                  background: selectedReport.severity === 'critical' ? '#fef2f2' : selectedReport.severity === 'high' ? '#fff7ed' : '#fefce8',
                  color: selectedReport.severity === 'critical' ? '#dc2626' : selectedReport.severity === 'high' ? '#ea580c' : '#ca8a04',
                  border: `1px solid ${selectedReport.severity === 'critical' ? '#fecaca' : selectedReport.severity === 'high' ? '#fed7aa' : '#fef08a'}`
                }}>
                  {selectedReport.severity === 'critical' ? 'Khẩn cấp' : selectedReport.severity === 'high' ? 'Mức độ cao' : 'Mức độ thường'}
                </span>

                <span style={{
                  fontSize: '0.725rem', fontWeight: 600, padding: '3px 9px', borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  background: selectedReport.status === 'resolved' ? '#ecfdf5' : selectedReport.status === 'dismissed' ? '#f1f5f9' : '#fff1f2',
                  color: selectedReport.status === 'resolved' ? '#059669' : selectedReport.status === 'dismissed' ? '#64748b' : '#e11d48',
                  border: `1px solid ${selectedReport.status === 'resolved' ? '#a7f3d0' : selectedReport.status === 'dismissed' ? '#e2e8f0' : '#fecdd3'}`
                }}>
                  {selectedReport.status === 'resolved' ? 'Đã giải quyết' : selectedReport.status === 'dismissed' ? 'Đã bác bỏ' : 'Chờ xử lý'}
                </span>
              </div>
            </div>

            {/* Dossier Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 2-Column Comparative Dossier */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', alignItems: 'start' }}>
                {/* CỘT TRÁI: Vật phẩm & 2 bên đối soát */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Vật phẩm liên quan */}
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Vật phẩm liên quan
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={selectedReport.itemImg}
                        alt={selectedReport.itemName}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {selectedReport.itemName}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          Mã bài đăng: {selectedReport.itemId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2 Bên đối soát */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {/* Người tố cáo */}
                    <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Bên gửi tố cáo
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '3px', color: 'var(--text-primary)' }}>
                        {selectedReport.reporter}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Thời điểm gửi: {selectedReport.time}
                      </div>
                    </div>

                    {/* Bên bị tố cáo */}
                    <div style={{ padding: '12px 14px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                      <div style={{ fontSize: '0.675rem', color: '#be123c', textTransform: 'uppercase', fontWeight: 700 }}>
                        Bên bị tố cáo (Tài khoản nghi vấn)
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '3px', color: '#9f1239' }}>
                        {selectedReport.reportedUser}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#be123c', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px', fontWeight: 600 }}>
                        <Phone size={12} /> {selectedReport.reportedUserPhone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CỘT PHẢI: Nội dung tố cáo & Bằng chứng */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Nội dung tố cáo */}
                  <div style={{ background: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Loại vi phạm: <span style={{ color: 'var(--teal-700)' }}>{selectedReport.typeLabel}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                      "{selectedReport.reason}"
                    </div>
                  </div>

                  {/* Bằng chứng xác minh */}
                  <div style={{ background: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Bằng chứng cung cấp:
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: '#fafbfc', padding: '10px 12px', borderRadius: '6px' }}>
                      {selectedReport.evidence}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── KHU VỰC QUẢN TRỊ VIÊN XỬ LÝ (Dedicated Reason Input in-place, NO popups) ── */}
              <div style={{
                background: '#f8fafc', borderRadius: '10px',
                padding: '20px 22px', border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                    Quyết định &amp; Kết luận xử lý của Quản trị viên
                  </div>
                  {selectedReport.status !== 'pending' && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                      ✓ Đã có quyết định
                    </span>
                  )}
                </div>

                {/* Ô input riêng để nhập lý do trực tiếp */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Lý do &amp; Căn cứ xử lý <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập nhận định, căn cứ xử lý vi phạm hoặc lý do bác bỏ khiếu nại (bắt buộc trước khi giải quyết hoặc khóa tài khoản)..."
                    value={resolutionReason}
                    onChange={(e) => setResolutionReason(e.target.value)}
                    disabled={selectedReport.status !== 'pending'}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.12)', fontSize: '0.85rem',
                      fontFamily: 'var(--font-body)', outline: 'none',
                      background: selectedReport.status !== 'pending' ? '#f1f5f9' : 'white',
                      lineHeight: 1.5, resize: 'vertical'
                    }}
                  />
                </div>

                {/* Hàng nút hành động xử lý trực tiếp */}
                {selectedReport.status === 'pending' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleAction('DISMISS_REPORT')}
                      style={{
                        padding: '8px 16px', borderRadius: '6px', background: 'white',
                        border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text-secondary)',
                        fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer'
                      }}
                      title="Bác bỏ khiếu nại sai căn cứ"
                    >
                      Bác bỏ khiếu nại
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction('RESOLVE_REPORT')}
                      style={{
                        padding: '8px 16px', borderRadius: '6px', background: 'var(--teal-600)',
                        border: 'none', color: 'white', fontSize: '0.825rem', fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Đánh dấu đã giải quyết"
                    >
                      Đã giải quyết / Cảnh cáo
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction('BAN_AND_RESOLVE')}
                      style={{
                        padding: '8px 16px', borderRadius: '6px', background: '#dc2626',
                        border: 'none', color: 'white', fontSize: '0.825rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        boxShadow: '0 1px 3px rgba(220, 38, 38, 0.2)'
                      }}
                      title="Khóa vĩnh viễn tài khoản người bị tố cáo"
                    >
                      <Ban size={14} />
                      <span>Khóa tài khoản vi phạm</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Hồ sơ này đã kết luận. Bạn có thể mở lại ca nếu cần phúc khảo.
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReopen(selectedReport.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px', borderRadius: '6px', background: 'white',
                        border: '1px solid rgba(0,0,0,0.15)', color: 'var(--teal-700)',
                        fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Mở lại ca để xử lý lại</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── VIEW 2: SUMMARY LIST (Chỉ hiển thị tóm tắt, nhấn trực tiếp để xem chi tiết) ── */
          <div>
            {/* Toolbar: Fast Filter Tabs */}
            <div style={{
              padding: '12px 24px', background: '#fafbfc', borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', gap: '6px', flexWrap: 'wrap'
            }}>
              {[
                { key: 'pending', label: 'Chờ xử lý', count: pendingCount },
                { key: 'fraud_claim', label: 'Nghi vấn mạo nhận', count: reports.filter(r => r.reportType === 'fraud_claim').length },
                { key: 'extortion', label: 'Đòi tiền chuộc', count: reports.filter(r => r.reportType === 'extortion').length },
                { key: 'dispute', label: 'Tranh chấp', count: reports.filter(r => r.reportType === 'dispute').length },
                { key: 'resolved', label: 'Đã giải quyết', count: resolvedCount },
                { key: 'all', label: 'Tất cả ca', count: reports.length },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setReportFilter(f.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                    border: reportFilter === f.key ? '1px solid var(--teal-600)' : '1px solid transparent',
                    background: reportFilter === f.key ? 'white' : 'transparent',
                    color: reportFilter === f.key ? 'var(--teal-700)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 120ms'
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{
                    fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px',
                    background: reportFilter === f.key ? 'var(--teal-50)' : 'rgba(0,0,0,0.04)',
                    color: reportFilter === f.key ? 'var(--teal-700)' : 'var(--text-muted)'
                  }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Summary Table */}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Mã ca &amp; Loại vi phạm</th>
                    <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Đối tượng tố cáo</th>
                    <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Tóm tắt lý do</th>
                    <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Vật phẩm</th>
                    <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Thời gian</th>
                    <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right', whiteSpace: 'nowrap', width: '140px' }}>Trạng thái</th>
                  </tr>
                </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr
                    key={report.id}
                    onClick={() => openReport(report)}
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                      background: report.status === 'pending' ? '#fffdfd' : 'white',
                      cursor: 'pointer',
                      transition: 'background 120ms'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = report.status === 'pending' ? '#fff5f5' : '#f8fafc';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = report.status === 'pending' ? '#fffdfd' : 'white';
                    }}
                  >
                    {/* Mã ca & Loại vi phạm */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--teal-700)', fontFamily: 'var(--font-mono)' }}>
                          {report.id}
                        </span>
                        <span style={{
                          fontSize: '0.675rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                          background: report.severity === 'critical' ? '#fef2f2' : report.severity === 'high' ? '#fff7ed' : '#fefce8',
                          color: report.severity === 'critical' ? '#dc2626' : report.severity === 'high' ? '#ea580c' : '#ca8a04',
                          border: `1px solid ${report.severity === 'critical' ? '#fecaca' : report.severity === 'high' ? '#fed7aa' : '#fef08a'}`
                        }}>
                          {report.severity === 'critical' ? 'Khẩn cấp' : report.severity === 'high' ? 'Cao' : 'Thường'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {report.typeLabel}
                      </div>
                    </td>

                    {/* Đối tượng */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Người gửi: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{report.reporter}</span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#be123c', fontWeight: 600, marginTop: '2px' }}>
                        Bị tố cáo: {report.reportedUser}
                      </div>
                    </td>

                    {/* Tóm tắt lý do */}
                    <td style={{ padding: '14px 18px', maxWidth: '280px' }}>
                      <div style={{
                        fontSize: '0.8rem', color: 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        "{report.reason}"
                      </div>
                      <div style={{
                        fontSize: '0.725rem', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px'
                      }}>
                        {report.evidence}
                      </div>
                    </td>

                    {/* Vật phẩm */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={report.itemImg}
                          alt={report.itemName}
                          style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                          {report.itemName}
                        </div>
                      </div>
                    </td>

                    {/* Thời gian */}
                    <td style={{ padding: '14px 18px', fontSize: '0.775rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {report.time}
                    </td>

                    {/* Trạng thái */}
                    <td style={{ padding: '14px 24px', textAlign: 'right', whiteSpace: 'nowrap', width: '140px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        background: report.status === 'resolved' ? '#ecfdf5' : report.status === 'dismissed' ? '#f1f5f9' : '#fff1f2',
                        color: report.status === 'resolved' ? '#059669' : report.status === 'dismissed' ? '#64748b' : '#e11d48',
                        border: `1px solid ${report.status === 'resolved' ? '#a7f3d0' : report.status === 'dismissed' ? '#e2e8f0' : '#fecdd3'}`
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          background: report.status === 'resolved' ? '#10b981' : report.status === 'dismissed' ? '#94a3b8' : '#e11d48'
                        }} />
                        {report.status === 'resolved' ? 'Đã giải quyết' : report.status === 'dismissed' ? 'Đã bác bỏ' : 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {filteredReports.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                Không có báo cáo vi phạm nào trong danh mục này.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
