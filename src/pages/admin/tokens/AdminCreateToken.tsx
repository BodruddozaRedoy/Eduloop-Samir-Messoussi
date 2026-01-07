import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminSearch } from "../components/AdminControls";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

const AdminCreateToken = () => {
  const [tab, setTab] = useState<"all" | "active">("all");

  const columns = [
    { key: "token", header: "Token" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action", className: "w-40" },
  ];

  const allRows = useMemo(
    () => [
      { token: "AB23XZ", status: "Active" },
      { token: "AB23XZ", status: "Active" },
      { token: "AB23XZ", status: "Deactivate" },
      { token: "AB23XZ", status: "Active" },
      { token: "AB23XZ", status: "Used" },
      { token: "AB23XZ", status: "Used" },
      { token: "AB23XZ", status: "Deactivate" },
    ],
    []
  );

  const rows = useMemo(() => {
    const filtered =
      tab === "active" ? allRows.filter((r) => r.status === "Active") : allRows;
    return filtered.map((r) => ({
      token: r.token,
      status: (
        <div className="flex items-center gap-2">
          {r.status === "Active" ? (
            <span className="h-2 w-2 rounded-full bg-green-500" />
          ) : r.status === "Used" ? (
            <span className="h-2 w-2 rounded-full bg-orange-500" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-gray-300" />
          )}
          <span
            className={
              r.status === "Active"
                ? "text-green-600"
                : r.status === "Used"
                  ? "text-orange-600"
                  : "text-gray-500"
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
          {r.status === "Used" ? (
            <button type="button" className="text-gray-700 hover:text-gray-900" aria-label="Refresh">
              <RefreshCcw className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ),
    }));
  }, [allRows, tab]);

  return (
    <div className="min-w-0">
      <AdminHeader
        title="Token Management"
        subtitle="Generate and control access tokens for students."
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTab("all")}
              className={
                tab === "all"
                  ? "h-9 rounded-lg bg-orange-600 px-6 text-xs font-semibold text-white"
                  : "h-9 rounded-lg bg-orange-50 px-6 text-xs font-semibold text-gray-700"
              }
            >
              All Token
            </button>
            <button
              type="button"
              onClick={() => setTab("active")}
              className={
                tab === "active"
                  ? "h-9 rounded-lg bg-orange-600 px-6 text-xs font-semibold text-white"
                  : "h-9 rounded-lg bg-orange-50 px-6 text-xs font-semibold text-gray-700"
              }
            >
              Active Token
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Add Token Button
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

export default AdminCreateToken;
