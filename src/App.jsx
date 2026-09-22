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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dang-nhap" element={<AuthPage />} />
        <Route path="/dang-ky" element={<AuthPage />} />
        <Route path="/dang-tin" element={<PostItemPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="/chi-tiet/:id" element={<ItemDetailPage />} />
        <Route path="/smart-match" element={<SmartMatchPage />} />
        <Route path="/xac-minh/:id" element={<ClaimItemPage />} />
        <Route path="/ho-so" element={<ProfilePage />} />
        <Route path="/tin-dang-cua-toi" element={<MyPostsPage />} />
        <Route path="/bai-dang-cua-toi" element={<MyPostsPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
