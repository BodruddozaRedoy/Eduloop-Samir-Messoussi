import {
    CircleHelp,
    LayoutDashboard,
    LogOut,
    Ticket,
    Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";

const linkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700";

const linkActive = "bg-white text-gray-900 shadow-sm";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("admin-token");
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-orange-100/60 px-6 py-6 md:h-screen">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-16 w-auto"
          loading="eager"
          decoding="async"
        />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : "hover:bg-white/50"}`
          }
        >
          <LayoutDashboard className="h-5 w-5 text-orange-600" />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/questions"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : "hover:bg-white/50"}`
          }
        >
          <CircleHelp className="h-5 w-5 text-orange-600" />
          Questions
        </NavLink>

        <NavLink
          to="/admin/tokens"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : "hover:bg-white/50"}`
          }
        >
          <Ticket className="h-5 w-5 text-orange-600" />
          Tokens
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : "hover:bg-white/50"}`
          }
        >
          <Users className="h-5 w-5 text-orange-600" />
          Users
        </NavLink>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 text-orange-600" />
            Log out
          </button>
        </div>
      </nav>
    </aside>
  );
}
