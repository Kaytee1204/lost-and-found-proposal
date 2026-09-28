import React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import UserFilterBar from '../components/users/UserFilterBar';
import UserTable from '../components/users/UserTable';
import UserCrudModal from '../components/users/UserCrudModal';
import UserActionModal from '../components/users/UserActionModal';

export default function AdminUsersPage() {
  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    actionModal,
    setActionModal,
    actionReason,
    setActionReason,
    crudModal,
    setCrudModal,
    formData,
    setFormData,
    toastMessage,
    executeAction,
    openCrudModal,
    submitCrud,
    counts
  } = useAdminUsers();

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
                {counts.total} tài khoản
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

        <UserFilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          counts={counts}
        />

        <UserTable
          filteredUsers={filteredUsers}
          openCrudModal={openCrudModal}
          setActionModal={setActionModal}
        />
      </div>

      <UserCrudModal
        crudModal={crudModal}
        setCrudModal={setCrudModal}
        formData={formData}
        setFormData={setFormData}
        submitCrud={submitCrud}
      />

      <UserActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        actionReason={actionReason}
        setActionReason={setActionReason}
        executeAction={executeAction}
      />
    </div>
  );
}
