import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import HomePage from '@/features/home/pages/HomePage';
import AuthPage from '@/features/auth/pages/AuthPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import PostItemPage from '@/features/items/pages/PostItemPage';
import SearchPage from '@/features/search/pages/SearchPage';
import ItemDetailPage from '@/features/items/pages/ItemDetailPage';
import SmartMatchPage from '@/features/smart-match/pages/SmartMatchPage';
import MyPostsPage from '@/features/profile/pages/MyPostsPage';
import ClaimItemPage from '@/features/items/pages/ClaimItemPage';
import AdminLayout from '@/components/layouts/admin/AdminLayout';
import MainLayout from '@/components/layouts/MainLayout';
import AdminOverviewPage from '@/features/admin/pages/AdminOverviewPage';
import AdminItemsPage from '@/features/admin/pages/AdminItemsPage';
import AdminReportsPage from '@/features/admin/pages/AdminReportsPage';
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage';
import AdminUserDetailsPage from '@/features/admin/pages/AdminUserDetailsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── CLIENT ROUTES (Navbar + Footer tự động từ MainLayout) ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dang-nhap" element={<AuthPage />} />
            <Route path="/dang-ky" element={<AuthPage />} />
            <Route path="/dang-tin" element={<PostItemPage />} />
            <Route path="/dang-tin-nhat-duoc" element={<PostItemPage />} />
            <Route path="/tim-kiem" element={<SearchPage />} />
            <Route path="/chi-tiet/:id" element={<ItemDetailPage />} />
            <Route path="/smart-match" element={<SmartMatchPage />} />
            <Route path="/xac-minh/:id" element={<ClaimItemPage />} />
            <Route path="/ho-so" element={<ProfilePage />} />
            <Route path="/tin-dang-cua-toi" element={<MyPostsPage />} />
            <Route path="/bai-dang-cua-toi" element={<MyPostsPage />} />
          </Route>

          {/* ── ADMIN NESTED ROUTES ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="items" element={<AdminItemsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailsPage />} />
          </Route>

          <Route path="/quan-tri" element={<Navigate to="/admin" replace />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
