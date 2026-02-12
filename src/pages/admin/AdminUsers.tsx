import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Trash2, UserPlus } from "lucide-react";

interface UserWithRole {
  user_id: string;
  email: string;
  display_name: string;
  role: string | null;
  role_id: string | null;
}

const roles = ["super_admin", "admin", "editor"];

const AdminUsers = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignRole, setAssignRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    // Get all profiles
    const { data: profiles } = await supabase.from("profiles" as any).select("user_id, display_name").order("created_at", { ascending: false });
    // Get all roles
    const { data: rolesData } = await supabase.from("user_roles" as any).select("id, user_id, role");

    if (!profiles) return;

    // We need emails - get them from auth via profiles
    // Since we can't query auth.users directly, we'll show what we have
    const merged: UserWithRole[] = (profiles as any[]).map((p: any) => {
      const userRoleEntry = (rolesData as any[] || []).find((r: any) => r.user_id === p.user_id);
      return {
        user_id: p.user_id,
        email: "", // Will be populated if we have it
        display_name: p.display_name || "Unknown",
        role: userRoleEntry?.role || null,
        role_id: userRoleEntry?.id || null,
      };
    });

    setUsers(merged);
  };

  useEffect(() => { fetchUsers(); }, []);

  const assignRoleToUser = async () => {
    if (!assignEmail.trim()) return;
    setError("");
    setLoading(true);

    // Find user by looking up profiles by display_name or we need to find by user_id
    // Since we can't query auth.users, we'll look for profiles matching the input
    const { data: profiles } = await supabase
      .from("profiles" as any)
      .select("user_id, display_name")
      .or(`display_name.ilike.%${assignEmail}%,user_id.eq.${assignEmail.includes("-") ? assignEmail : "00000000-0000-0000-0000-000000000000"}`);

    if (!profiles || (profiles as any[]).length === 0) {
      setError("No user found. Try entering their display name or user ID.");
      setLoading(false);
      return;
    }

    const targetUserId = (profiles as any[])[0].user_id;

    // Check if role already exists
    const { data: existing } = await supabase.from("user_roles" as any).select("id").eq("user_id", targetUserId).maybeSingle();

    if (existing) {
      await supabase.from("user_roles" as any).update({ role: assignRole } as any).eq("user_id", targetUserId);
    } else {
      await supabase.from("user_roles" as any).insert({ user_id: targetUserId, role: assignRole } as any);
    }

    setAssignEmail("");
    setLoading(false);
    fetchUsers();
  };

  const removeRole = async (roleId: string) => {
    if (!confirm("Remove this user's role?")) return;
    await supabase.from("user_roles" as any).delete().eq("id", roleId);
    fetchUsers();
  };

  if (userRole !== "super_admin") {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="font-display text-lg font-semibold text-card-foreground">Super Admin Only</h2>
        <p className="mt-2 text-sm text-muted-foreground">Only super admins can manage user roles.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-foreground">User Management</h1>
      <p className="mb-8 text-sm text-muted-foreground">Assign and manage admin roles for users.</p>

      {/* Assign Role */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-card-foreground">
          <UserPlus size={18} /> Assign Role
        </h2>
        {error && <div className="mb-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Display name or User ID"
            value={assignEmail}
            onChange={(e) => setAssignEmail(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={assignRole}
            onChange={(e) => setAssignRole(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={assignRoleToUser}
            disabled={loading}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Display Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">User ID</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-card-foreground">{u.display_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.user_id.slice(0, 8)}...</td>
                <td className="px-4 py-3">
                  {u.role ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      u.role === "super_admin" ? "bg-destructive/10 text-destructive" :
                      u.role === "admin" ? "bg-primary/10 text-primary" :
                      "bg-accent text-accent-foreground"
                    }`}>{u.role}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No role</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role_id && (
                    <button onClick={() => removeRole(u.role_id!)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
