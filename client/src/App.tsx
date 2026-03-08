import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingOverlay } from './core/loading';
import { useAuthStore } from './core/store/useAuthStore';
import { LoginPage } from './domains/auth';
import { HomePage } from './domains/home';
import { NoticePage } from './domains/board';
import {
  LogisticsListPage,
  LogisticsCompletedPage,
  LogisticsExportRegisterPage,
  ExportItemAddPage,
  SiteTransferRegisterPage,
  LogisticsDetailPage,
} from './domains/logistics';

/** 인증된 사용자만 접근 가능한 라우트 보호 래퍼 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <>
      <LoadingOverlay />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/notice"
          element={
            <ProtectedRoute>
              <NoticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics"
          element={
            <ProtectedRoute>
              <LogisticsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/completed"
          element={
            <ProtectedRoute>
              <LogisticsCompletedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/:docNo"
          element={
            <ProtectedRoute>
              <LogisticsDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/register/export"
          element={
            <ProtectedRoute>
              <LogisticsExportRegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/register/export/item-add"
          element={
            <ProtectedRoute>
              <ExportItemAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/register/transfer"
          element={
            <ProtectedRoute>
              <SiteTransferRegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
