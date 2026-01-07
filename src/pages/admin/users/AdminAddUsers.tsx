import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { AdminSearch } from "../components/AdminControls";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

const AdminAddUsers = () => {
  const columns = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action", className: "w-32" },
  ];

  const rows = useMemo(
    () =>
      [
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Active",
        },
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Active",
        },
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Active",
        },
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Samir",
          email: "samir@gmail.com",
          role: "Admin",
          status: "Active",
        },
      ].map((r) => ({
        ...r,
        role: (
          <span className="inline-flex h-7 items-center rounded-full bg-orange-100 px-4 text-xs font-semibold text-orange-700">
            {r.role}
          </span>
        ),
        status: (
          <div className="flex items-center gap-2">
            <span
              className={
                r.status === "Active"
                  ? "h-2 w-2 rounded-full bg-green-500"
                  : "h-2 w-2 rounded-full bg-gray-300"
              }
            />
            <span
              className={
                r.status === "Active" ? "text-green-600" : "text-gray-500"
              }
            >
              {r.status}
            </span>
          </div>
        ),
        action: (
          <div className="flex items-center gap-3">
            <button type="button" className="text-red-500 hover:text-red-600" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" className="text-gray-700 hover:text-gray-900" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ),
      })),
    []
  );

  return (
    <div className="min-w-0">
      <AdminHeader
        title="User Management"
        subtitle="Add, edit, and manage admin users."
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex h-9 items-center rounded-lg bg-orange-600 px-10 text-xs font-semibold text-white">
            Admin
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Create User
          </button>
        </div>

        <div className="mt-5">
          <AdminSearch />
        </div>

        <div className="mt-6">
          <AdminTable columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default AdminAddUsers;
