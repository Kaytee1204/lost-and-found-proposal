import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Ban, Trash2, Shield, User, Eye, Search, CheckCircle2, UserCheck, AlertOctagon } from 'lucide-react';
import { USERS_LIST } from './mockData';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(USERS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for actions that require a reason (Ban, Delete)
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', payload: null, title: '', placeholder: '' });
  const [actionReason, setActionReason] = useState('');

  // Modal for Create/Update User
  const [crudModal, setCrudModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Thành viên', trustScore: 100, status: 'Hoạt động' });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* --- BAN / DELETE LOGIC --- */
  const executeAction = () => {
    if (!actionReason.trim()) {
      showToast('Vui lòng nhập lý do thực hiện');
      return;
    }

    const { type, payload } = actionModal;

    if (type === 'BAN_USER') {
      setUsers(prev => prev.map(u => u.id === payload ? { ...u, status: 'Đã tạm khóa' } : u));
      showToast(`Đã khóa tài khoản ${payload}`);
    } else if (type === 'UNBAN_USER') {
      setUsers(prev => prev.map(u => u.id === payload ? { ...u, status: 'Hoạt động' } : u));
      showToast(`Đã mở khóa tài khoản ${payload}`);
    } else if (type === 'DELETE_USER') {
      setUsers(prev => prev.filter(u => u.id !== payload));
      showToast(`Đã xóa tài khoản ${payload}`);
    }

    setActionModal({ isOpen: false, type: '', payload: null, title: '', placeholder: '' });
    setActionReason('');
  };

  /* --- CREATE / UPDATE LOGIC --- */
  const openCrudModal = (mode, user = null) => {
    if (mode === 'edit' && user) {
      setFormData({ name: user.name, email: user.email, role: user.role, trustScore: user.trustScore, status: user.status });
      setCrudModal({ isOpen: true, mode: 'edit', data: user });
    } else {
      setFormData({ name: '', email: '', role: 'Thành viên', trustScore: 100, status: 'Hoạt động' });
      setCrudModal({ isOpen: true, mode: 'create', data: null });
    }
  };

  const submitCrud = (e) => {
    e.preventDefault();
    if (crudModal.mode === 'create') {
      const newUser = {
        id: `USR-${Math.floor(Math.random() * 900) + 100}`,
        ...formData,
        returnsCount: 0,
        verified: false,
      };
      setUsers([newUser, ...users]);
      showToast(`Đã tạo tài khoản: ${newUser.name}`);
    } else {
      setUsers(prev => prev.map(u => u.id === crudModal.data.id ? { ...u, ...formData } : u));
      showToast(`Đã cập nhật tài khoản ${crudModal.data.id}`);
    }
    setCrudModal({ isOpen: false, mode: 'create', data: null });
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && u.status === 'Hoạt động') ||
        (statusFilter === 'banned' && u.status === 'Đã tạm khóa') ||
        (statusFilter === 'warning' && (u.role === 'Cảnh báo' || u.trustScore < 50));

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const activeCount = users.filter(u => u.status === 'Hoạt động').length;
  const bannedCount = users.filter(u => u.status === 'Đã tạm khóa').length;
  const warningCount = users.filter(u => u.role === 'Cảnh báo' || u.trustScore < 50).length;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
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

      {/* ── UNIFIED WORKBENCH CONTAINER ── */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Header bar */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Tài khoản thành viên
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(30,107,107,0.08)', color: 'var(--teal-700)', padding: '2px 8px', borderRadius: '12px' }}>
                {users.length} tài khoản
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Theo dõi độ uy tín, phân quyền và kiểm soát quyền truy cập hệ thống
            </p>
          </div>

          <button
            onClick={() => openCrudModal('create')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '9px 16px', background: 'var(--teal-600)', color: 'white',
              borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.85rem',
              cursor: 'pointer', transition: 'background 120ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Plus size={15} /> Thêm tài khoản
          </button>
        </div>

        {/* Toolbar: Status Tabs & Fast Search */}
        <div style={{
          padding: '12px 24px', background: '#fafbfc', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'Tất cả', count: users.length },
              { id: 'active', label: 'Đang hoạt động', count: activeCount },
              { id: 'banned', label: 'Đã tạm khóa', count: bannedCount },
              { id: 'warning', label: 'Cần chú ý', count: warningCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                  border: statusFilter === tab.id ? '1px solid var(--teal-600)' : '1px solid transparent',
                  background: statusFilter === tab.id ? 'white' : 'transparent',
                  color: statusFilter === tab.id ? 'var(--teal-700)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 120ms'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px',
                  background: statusFilter === tab.id ? 'var(--teal-50)' : 'rgba(0,0,0,0.04)',
                  color: statusFilter === tab.id ? 'var(--teal-700)' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', padding: '6px 12px', borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.12)', width: '260px'
          }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, ID..."
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
        </div>

        {/* Data Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Thành viên</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vai trò</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Điểm uy tín</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trạng thái</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const isWarning = user.trustScore < 50 || user.role === 'Cảnh báo';
              return (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'background 120ms'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                >
                  {/* Thành viên & Email */}
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: user.role === 'Admin' ? '#f3e8ff' : '#f1f5f9',
                        color: user.role === 'Admin' ? '#7e22ce' : 'var(--teal-700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{user.name}</span>
                          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
                            {user.id}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Vai trò */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                      background: user.role === 'Admin' ? '#f3e8ff' : user.role === 'Thành viên Tích Cực' ? 'rgba(45,212,191,0.12)' : isWarning ? '#fff7ed' : '#f1f5f9',
                      color: user.role === 'Admin' ? '#7e22ce' : user.role === 'Thành viên Tích Cực' ? 'var(--teal-700)' : isWarning ? '#c2410c' : 'var(--text-secondary)'
                    }}>
                      {user.role === 'Admin' ? <Shield size={12} /> : isWarning ? <AlertOctagon size={12} /> : <User size={12} />}
                      {user.role}
                    </span>
                  </td>

                  {/* Điểm uy tín */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '70px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${user.trustScore}%`, height: '100%',
                          background: user.trustScore > 80 ? '#10b981' : user.trustScore > 50 ? '#f59e0b' : '#ef4444',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{
                        fontWeight: 700, fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums',
                        color: user.trustScore > 80 ? '#059669' : user.trustScore > 50 ? '#d97706' : '#dc2626'
                      }}>
                        {user.trustScore}
                      </span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                      background: user.status === 'Hoạt động' ? '#ecfdf5' : '#fef2f2',
                      color: user.status === 'Hoạt động' ? '#059669' : '#dc2626'
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: user.status === 'Hoạt động' ? '#10b981' : '#ef4444' }} />
                      {user.status}
                    </span>
                  </td>

                  {/* Thao tác (Direct actions only, click row to view profile) */}
                  <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCrudModal('edit', user);
                        }}
                        style={{
                          padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)',
                          background: 'white', color: 'var(--text-secondary)', cursor: 'pointer'
                        }}
                        title="Sửa thông tin"
                      >
                        <Edit2 size={13} />
                      </button>

                      {user.status === 'Hoạt động' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionModal({ isOpen: true, type: 'BAN_USER', payload: user.id, title: 'Khóa tài khoản', placeholder: 'Nhập lý do khóa tài khoản này...' });
                          }}
                          style={{
                            padding: '5px 8px', borderRadius: '6px', border: '1px solid #fed7aa',
                            background: '#fff7ed', color: '#ea580c', cursor: 'pointer'
                          }}
                          title="Tạm khóa tài khoản"
                        >
                          <Ban size={13} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionModal({ isOpen: true, type: 'UNBAN_USER', payload: user.id, title: 'Mở khóa tài khoản', placeholder: 'Nhập lý do mở khóa...' });
                          }}
                          style={{
                            padding: '5px 8px', borderRadius: '6px', border: '1px solid #a7f3d0',
                            background: '#ecfdf5', color: '#059669', cursor: 'pointer'
                          }}
                          title="Mở khóa tài khoản"
                        >
                          <UserCheck size={13} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionModal({ isOpen: true, type: 'DELETE_USER', payload: user.id, title: 'Xóa tài khoản', placeholder: 'Nhập lý do xóa vĩnh viễn tài khoản...' });
                        }}
                        style={{
                          padding: '5px 8px', borderRadius: '6px', border: '1px solid #fecaca',
                          background: '#fef2f2', color: '#dc2626', cursor: 'pointer'
                        }}
                        title="Xóa tài khoản"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  Không tìm thấy tài khoản phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL 1: ADD / EDIT USER ── */}
      {crudModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              {crudModal.mode === 'create' ? 'Tạo mới tài khoản thành viên' : 'Chỉnh sửa tài khoản'}
            </h3>

            <form onSubmit={submitCrud} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Họ và tên</label>
                <input
                  type="text" required
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email" required
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Vai trò</label>
                  <select
                    value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', background: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="Thành viên">Thành viên</option>
                    <option value="Thành viên Tích Cực">Thành viên Tích Cực</option>
                    <option value="Cảnh báo">Trong diện cảnh báo</option>
                    <option value="Admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Điểm uy tín (0-100)</label>
                  <input
                    type="number" min="0" max="100"
                    value={formData.trustScore} onChange={e => setFormData({ ...formData, trustScore: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Trạng thái tài khoản</label>
                <select
                  value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', background: 'white', fontSize: '0.85rem' }}
                >
                  <option value="Hoạt động">Hoạt động bình thường</option>
                  <option value="Đã tạm khóa">Đã tạm khóa</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCrudModal({ isOpen: false, mode: 'create', data: null })}
                  style={{ padding: '8px 14px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid rgba(0,0,0,0.06)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '6px', background: 'var(--teal-600)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {crudModal.mode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ACTION REASON (BAN / DELETE) ── */}
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
                  background: actionModal.type === 'DELETE_USER' ? '#ef4444' : 'var(--teal-600)', color: 'white'
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
