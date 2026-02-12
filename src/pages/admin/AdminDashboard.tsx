import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Megaphone, Image, BookOpen, Users, Globe } from "lucide-react";

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [counts, setCounts] = useState({ announcements: 0, gallery: 0, research: 0, organizations: 0, extensions: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const tables = ["announcements", "gallery", "research", "organizations", "extensions"] as const;
      const results: any = {};
      for (const t of tables) {
        const { count } = await supabase.from(t as any).select("*", { count: "exact", head: true });
        results[t] = count || 0;
      }
      setCounts(results);
    };
    fetchCounts();
  }, []);

  const stats = [
    { icon: Megaphone, label: "Announcements", count: counts.announcements, color: "bg-primary/10 text-primary" },
    { icon: Image, label: "Gallery", count: counts.gallery, color: "bg-secondary/20 text-secondary-foreground" },
    { icon: BookOpen, label: "Research", count: counts.research, color: "bg-accent text-accent-foreground" },
    { icon: Users, label: "Organizations", count: counts.organizations, color: "bg-primary/10 text-primary" },
    { icon: Globe, label: "Extensions", count: counts.extensions, color: "bg-secondary/20 text-secondary-foreground" },
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Welcome back, {user?.email}. Role: <span className="font-medium text-primary">{userRole || "none"}</span>
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
