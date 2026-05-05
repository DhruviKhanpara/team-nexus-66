import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AllRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <Routes>
    <Route
      path="/login"
      element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
    />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AppLayout />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AllRoutes;
