import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Megaphone, Image, BookOpen, Users, Globe, LogOut, Shield } from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: BookOpen, label: "Research", path: "/admin/research" },
  { icon: Users, label: "Organizations", path: "/admin/organizations" },
  { icon: Globe, label: "Extensions", path: "/admin/extensions" },
  { icon: Shield, label: "Users", path: "/admin/users" },
];

const AdminLayout = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">C</div>
          <span className="font-display text-base font-bold text-card-foreground">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">{user.email}</div>
          {!isAdmin && (
            <div className="mb-3 rounded-lg bg-secondary/20 p-2 text-xs text-secondary-foreground">
              No admin role assigned. Contact a super admin.
            </div>
          )}
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
