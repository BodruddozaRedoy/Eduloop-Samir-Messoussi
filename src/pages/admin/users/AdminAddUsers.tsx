import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AxiosAdmin } from "@/config/axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
};

const AdminAddUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    is_staff: false,
    is_active: false,
  });

  // Create modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    username: "",
    is_staff: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action", className: "w-32" },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AxiosAdmin.get<ApiResponse>("/users/");
      setUsers(res.data?.results ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEditModal = useCallback((user: User) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      password: "",
      confirm_password: "",
      is_staff: user.is_staff,
      is_active: user.is_active,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleEditUser = useCallback(async () => {
    if (!editingUser) return;

    if (!editForm.email.trim()) {
      alert("Email is required");
      return;
    }

    if (editForm.password && editForm.password !== editForm.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const payload: {
        email: string;
        is_staff: boolean;
        is_active: boolean;
        password?: string;
        confirm_password?: string;
      } = {
        email: editForm.email.trim(),
        is_staff: editForm.is_staff,
        is_active: editForm.is_active,
      };

      // Only include password if provided
      if (editForm.password) {
        payload.password = editForm.password;
        payload.confirm_password = editForm.confirm_password;
      }

      await AxiosAdmin.patch(`/users/${editingUser.id}/`, payload);
      await fetchUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
      setEditForm({
        email: "",
        password: "",
        confirm_password: "",
        is_staff: false,
        is_active: false,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [editingUser, editForm, fetchUsers]);

  const handleCreateUser = useCallback(async () => {
    if (!createForm.email.trim() || !createForm.username.trim() || !createForm.password) {
      alert("Email, username, and password are required");
      return;
    }

    if (createForm.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (createForm.password !== createForm.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await AxiosAdmin.post("/users/", {
        email: createForm.email.trim(),
        password: createForm.password,
        confirm_password: createForm.confirm_password,
        username: createForm.username.trim(),
        is_staff: createForm.is_staff,
      });
      await fetchUsers();
      setIsCreateModalOpen(false);
      setCreateForm({
        email: "",
        password: "",
        confirm_password: "",
        username: "",
        is_staff: false,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [createForm, fetchUsers]);

  const handleDeleteUser = useCallback(async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user: ${username}?`)) {
      return;
    }

    setDeleting(userId);
    try {
      await AxiosAdmin.delete(`/users/${userId}/`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleting(null);
    }
  }, [fetchUsers]);

  const handleToggleStatus = useCallback(async (user: User) => {
    setToggling(user.id);
    try {
      await AxiosAdmin.patch(`/users/${user.id}/`, {
        email: user.email,
        is_staff: user.is_staff,
        is_active: !user.is_active,
      });
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update user status. Please try again.");
    } finally {
      setToggling(null);
    }
  }, [fetchUsers]);

  const rows = useMemo(
    () =>
      users.map((user) => ({
        username: user.username,
        email: user.email,
        role: (
          <span className="inline-flex h-7 items-center rounded-full bg-orange-100 px-4 text-xs font-semibold text-orange-700">
            {user.is_staff ? "Admin" : "User"}
          </span>
        ),
        status: (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggleStatus(user)}
              disabled={toggling === user.id}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                user.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
              aria-label="Toggle status"
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out transform ${
                  user.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={
                user.is_active ? "text-green-600 text-sm" : "text-gray-500 text-sm"
              }
            >
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        ),
        action: (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleDeleteUser(user.id, user.username)}
              disabled={deleting === user.id}
              className="text-red-500 hover:text-red-600 disabled:opacity-50"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openEditModal(user)}
              className="text-gray-700 hover:text-gray-900"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ),
      })),
    [users, deleting, toggling, openEditModal, handleDeleteUser, handleToggleStatus]
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
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Create User
          </button>
        </div>

        <div className="mt-5">
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              Loading users...
            </div>
          ) : (
            <AdminTable columns={columns} rows={rows} />
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-orange-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
            <DialogTitle className="text-white text-base font-semibold">
              Update User
            </DialogTitle>
            <p className="text-white text-xs mt-1 opacity-90">
              Update user details and permissions
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-gray-400 text-xs">(leave blank to keep current)</span>
              </label>
              <input
                id="password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                type="password"
                value={editForm.confirm_password}
                onChange={(e) => setEditForm({ ...editForm, confirm_password: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_staff"
                type="checkbox"
                checked={editForm.is_staff}
                onChange={(e) => setEditForm({ ...editForm, is_staff: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="is_staff" className="text-sm font-medium text-gray-700">
                Is Staff (Admin)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={editForm.is_active}
                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Is Active
              </label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={handleEditUser}
              disabled={submitting || !editForm.email.trim()}
              className="h-9 px-6 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update User"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
                setEditForm({
                  email: "",
                  password: "",
                  confirm_password: "",
                  is_staff: false,
                  is_active: false,
                });
              }}
              disabled={submitting}
              className="h-9 px-6 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-orange-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
            <DialogTitle className="text-white text-base font-semibold">
              Create New User
            </DialogTitle>
            <p className="text-white text-xs mt-1 opacity-90">
              Add a new user to the system
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="create-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="create-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="create-confirm-password"
                type="password"
                value={createForm.confirm_password}
                onChange={(e) => setCreateForm({ ...createForm, confirm_password: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="create-username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="create-username"
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="create-is-staff"
                type="checkbox"
                checked={createForm.is_staff}
                onChange={(e) => setCreateForm({ ...createForm, is_staff: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="create-is-staff" className="text-sm font-medium text-gray-700">
                Is Staff (Admin)
              </label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={handleCreateUser}
              disabled={submitting || !createForm.email.trim() || !createForm.username.trim() || !createForm.password}
              className="h-9 px-6 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setCreateForm({
                  email: "",
                  password: "",
                  confirm_password: "",
                  username: "",
                  is_staff: false,
                });
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

export default AdminAddUsers;
