import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Item {
  id: string;
  name: string;
  position: string;
  org: string;
  image_url: string;
  bio: string;
  sort_order: number;
}

const orgs = ["Faculty", "CITCS SC", "PASOA", "JPCS", "The Technotes"];
const empty: Omit<Item, "id"> = { name: "", position: "", org: "Faculty", image_url: "", bio: "", sort_order: 0 };

const AdminOrganizations = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterOrg, setFilterOrg] = useState("All");

  const fetchData = async () => {
    const { data } = await supabase.from("organizations" as any).select("*").order("sort_order", { ascending: true });
    setItems((data as any) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filterOrg === "All" ? items : items.filter(i => i.org === filterOrg);

  const save = async () => {
    if (!editing?.name) return;
    setLoading(true);
    const payload = { name: editing.name, position: editing.position, org: editing.org, image_url: editing.image_url, bio: editing.bio, sort_order: editing.sort_order || 0 } as any;
    if (editing.id) {
      await supabase.from("organizations" as any).update(payload).eq("id", editing.id);
    } else {
      await supabase.from("organizations" as any).insert(payload);
    }
    setEditing(null);
    setLoading(false);
    fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("organizations" as any).delete().eq("id", id);
    fetchData();
  };

  const uploadImage = async (file: File) => {
    const path = `organizations/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) return "";
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    return data.publicUrl;
  };

  if (!isAdmin) return <div className="text-muted-foreground">You need admin access.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Organizations</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:scale-105 transition-transform">
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", ...orgs].map((o) => (
          <button key={o} onClick={() => setFilterOrg(o)} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${filterOrg === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{o}</button>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-card-foreground">{editing.id ? "Edit" : "Add"} Member</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Name" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Position" value={editing.position || ""} onChange={e => setEditing({ ...editing, position: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Organization</label>
                <select value={editing.org || "Faculty"} onChange={e => setEditing({ ...editing, org: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {orgs.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <textarea placeholder="Bio" rows={3} value={editing.bio || ""} onChange={e => setEditing({ ...editing, bio: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input type="number" placeholder="Sort Order" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Image</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadImage(file);
                    if (url) setEditing(prev => ({ ...prev, image_url: url }));
                  }
                }} className="w-full text-sm" />
                {editing.image_url && <img src={editing.image_url} alt="" className="mt-2 h-24 w-full rounded-lg object-cover" />}
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
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Position</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Org</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-card-foreground">{item.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.position}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{item.org}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="mr-2 text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No members yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrganizations;
