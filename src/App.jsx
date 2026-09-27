import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import PostItemPage from './pages/PostItemPage';
import SearchPage from './pages/SearchPage';
import ItemDetailPage from './pages/ItemDetailPage';
import SmartMatchPage from './pages/SmartMatchPage';
import MyPostsPage from './pages/MyPostsPage';
import ClaimItemPage from './pages/ClaimItemPage';
import AdminLayout from './layouts/AdminLayout';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        {/* Admin Nested Routes */}
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
  );
}
