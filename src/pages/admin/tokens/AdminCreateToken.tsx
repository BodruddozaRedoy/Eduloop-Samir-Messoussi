import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AxiosAdmin } from "@/config/axios";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

type Token = {
  key: string;
  description?: string;
  is_active: boolean;
  created_at: string;
};

type ApiListResponse = {
  count: number;
  results: Token[];
};

const AdminCreateToken = () => {
  const [tab, setTab] = useState<"all" | "active">("all");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTokenValue, setNewTokenValue] = useState("");
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [editTokenValue, setEditTokenValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: "token", header: "Token" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action", className: "w-40" },
  ];

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const params = tab === "active" ? { is_active: true } : {};
      const res = await AxiosAdmin.get<ApiListResponse>("/token-list/", { params });
      setTokens(res.data?.results ?? []);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleDelete = useCallback(async (tokenKey: string) => {
    if (!confirm(`Are you sure you want to delete token: ${tokenKey}?`)) {
      return;
    }

    setDeleting(tokenKey);
    try {
      await AxiosAdmin.delete("/token-delete/", {
        data: { key: tokenKey },
      });
      await fetchTokens();
    } catch (error) {
      console.error("Failed to delete token:", error);
      alert("Failed to delete token. Please try again.");
    } finally {
      setDeleting(null);
    }
  }, [fetchTokens]);

  const handleToggleStatus = useCallback(async (token: Token) => {
    setToggling(token.key);
    try {
      await AxiosAdmin.put("/token-update/", {
        key: token.key,
        is_active: !token.is_active,
      });
      await fetchTokens();
    } catch (error) {
      console.error("Failed to update token status:", error);
      alert("Failed to update token status. Please try again.");
    } finally {
      setToggling(null);
    }
  }, [fetchTokens]);

  const handleCreateToken = useCallback(async () => {
    if (!newTokenValue.trim()) {
      alert("Please enter a token value");
      return;
    }

    setSubmitting(true);
    try {
      await AxiosAdmin.post("/token-generate/", {
        key: newTokenValue.trim(),
      });
      await fetchTokens();
      setIsCreateModalOpen(false);
      setNewTokenValue("");
    } catch (error) {
      console.error("Failed to create token:", error);
      alert("Failed to create token. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [newTokenValue, fetchTokens]);

  const handleEditToken = useCallback(async () => {
    if (!editTokenValue.trim() || !editingToken) {
      alert("Please enter a token value");
      return;
    }

    setSubmitting(true);
    try {
      await AxiosAdmin.put("/token-update/", {
        key: editingToken.key,
        new_key: editTokenValue.trim(),
      });
      await fetchTokens();
      setIsEditModalOpen(false);
      setEditingToken(null);
      setEditTokenValue("");
    } catch (error) {
      console.error("Failed to update token:", error);
      alert("Failed to update token. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [editTokenValue, editingToken, fetchTokens]);

  const openEditModal = useCallback((token: Token) => {
    setEditingToken(token);
    setEditTokenValue(token.key);
    setIsEditModalOpen(true);
  }, []);

  const rows = useMemo(() => {
    return tokens.map((token) => ({
      token: token.key,
      status: (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleToggleStatus(token)}
            disabled={toggling === token.key}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
              token.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
            aria-label="Toggle status"
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out transform ${
                token.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={
              token.is_active ? "text-green-600 text-sm" : "text-gray-500 text-sm"
            }
          >
            {token.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDelete(token.key)}
            disabled={deleting === token.key}
            className="text-red-500 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(token)}
            className="text-gray-700 hover:text-gray-900"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {!token.is_active ? (
            <button type="button" className="text-gray-700 hover:text-gray-900" aria-label="Refresh">
              <RefreshCcw className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ),
    }));
  }, [tokens, deleting, toggling, handleDelete, handleToggleStatus, openEditModal]);

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
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Add Token Button
          </button>
        </div>

        <div className="mt-5">
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              Loading tokens...
            </div>
          ) : (
            <AdminTable columns={columns} rows={rows} />
          )}
        </div>
      </div>

      {/* Create Token Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-orange-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
            <DialogTitle className="text-white text-base font-semibold">
              Generate New Token
            </DialogTitle>
            <p className="text-white text-xs mt-1 opacity-90">
              Generate and control access tokens for students.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Token <span className="text-red-500">*</span>
              </label>
              <input
                id="token"
                type="text"
                value={newTokenValue}
                onChange={(e) => setNewTokenValue(e.target.value)}
                placeholder="Enter token value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={handleCreateToken}
              disabled={submitting || !newTokenValue.trim()}
              className="h-9 px-6 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Token"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewTokenValue("");
              }}
              disabled={submitting}
              className="h-9 px-6 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Token Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-orange-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
            <DialogTitle className="text-white text-base font-semibold">
              Edit Token
            </DialogTitle>
            <p className="text-white text-xs mt-1 opacity-90">
              Update the token value
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-token" className="block text-sm font-medium text-gray-700 mb-2">
                Token <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-token"
                type="text"
                value={editTokenValue}
                onChange={(e) => setEditTokenValue(e.target.value)}
                placeholder="Enter new token value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={handleEditToken}
              disabled={submitting || !editTokenValue.trim()}
              className="h-9 px-6 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Token"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingToken(null);
                setEditTokenValue("");
              }}
              disabled={submitting}
              className="h-9 px-6 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCreateToken;
