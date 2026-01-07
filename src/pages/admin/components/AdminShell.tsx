import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-gray-200">
      <div className="flex min-h-screen w-full overflow-hidden bg-white">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile sidebar drawer */}
        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute left-0 top-0 h-full">
              <AdminSidebar />
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute left-[272px] top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
