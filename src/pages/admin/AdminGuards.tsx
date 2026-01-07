import { Navigate, Outlet, useLocation } from "react-router";
import AdminShell from "./components/AdminShell";

const ADMIN_TOKEN_KEY = "admin-token";

export function AdminProtectedLayout() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const location = useLocation();

  if (!token) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/admin/login" replace state={{ from }} />;
  }

  return <AdminShell />;
}

export function AdminPublicOnlyLayout() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export function AdminIndexRedirect() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return <Navigate to={token ? "/admin/dashboard" : "/admin/login"} replace />;
}
