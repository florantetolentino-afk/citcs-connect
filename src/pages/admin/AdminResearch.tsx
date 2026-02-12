import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Item {
  id: string;
  title: string;
  abstract: string;
  program: string;
  role: string;
  type: string;
  year: string;
  status: string;
  adviser: string;
}

const empty: Omit<Item, "id"> = { title: "", abstract: "", program: "BSIT", role: "Student", type: "Capstone", year: "2026", status: "Pending", adviser: "" };

const AdminResearch = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("research" as any).select("*").order("created_at", { ascending: false });
    setItems((data as any) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    if (!editing?.title) return;
    setLoading(true);
    const payload = { title: editing.title, abstract: editing.abstract, program: editing.program, role: editing.role, type: editing.type, year: editing.year, status: editing.status, adviser: editing.adviser } as any;
    if (editing.id) {
      await supabase.from("research" as any).update(payload).eq("id", editing.id);
    } else {
      await supabase.from("research" as any).insert(payload);
    }
    setEditing(null);
    setLoading(false);
    fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this research?")) return;
    await supabase.from("research" as any).delete().eq("id", id);
    fetchData();
  };

  if (!isAdmin) return <div className="text-muted-foreground">You need admin access.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Research & Thesis</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:scale-105 transition-transform">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-card-foreground">{editing.id ? "Edit" : "Add"} Research</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Abstract" rows={4} value={editing.abstract || ""} onChange={e => setEditing({ ...editing, abstract: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Program</label>
                  <select value={editing.program || "BSIT"} onChange={e => setEditing({ ...editing, program: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>BSIT</option><option>BSOA</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Role</label>
                  <select value={editing.role || "Student"} onChange={e => setEditing({ ...editing, role: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>Student</option><option>Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Type</label>
                  <select value={editing.type || "Capstone"} onChange={e => setEditing({ ...editing, type: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>Capstone</option><option>Thesis</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Year</label>
                  <input value={editing.year || ""} onChange={e => setEditing({ ...editing, year: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Status</label>
                  <select value={editing.status || "Pending"} onChange={e => setEditing({ ...editing, status: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>Pending</option><option>Approved</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Adviser</label>
                  <input value={editing.adviser || ""} onChange={e => setEditing({ ...editing, adviser: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={save} disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Program</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="max-w-xs truncate px-4 py-3 text-card-foreground">{item.title}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{item.program}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{item.type}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${item.status === "Approved" ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary-foreground"}`}>{item.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="mr-2 text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No research items yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResearch;
