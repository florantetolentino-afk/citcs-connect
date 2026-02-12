import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Item {
  id: string;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

const empty: Omit<Item, "id"> = { title: "", summary: "", description: "", image_url: "", is_featured: false };

const AdminAnnouncements = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("announcements" as any).select("*").order("created_at", { ascending: false });
    setItems((data as any) || []);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!editing?.title) return;
    setLoading(true);
    if (editing.id) {
      await supabase.from("announcements" as any).update({ title: editing.title, summary: editing.summary, description: editing.description, image_url: editing.image_url, is_featured: editing.is_featured } as any).eq("id", editing.id);
    } else {
      await supabase.from("announcements" as any).insert({ title: editing.title, summary: editing.summary, description: editing.description, image_url: editing.image_url, is_featured: editing.is_featured } as any);
    }
    setEditing(null);
    setLoading(false);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements" as any).delete().eq("id", id);
    fetch();
  };

  const uploadImage = async (file: File) => {
    const path = `announcements/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) return "";
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    return data.publicUrl;
  };

  if (!isAdmin) return <div className="text-muted-foreground">You need admin access to manage announcements.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Announcements</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:scale-105">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Form Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-card-foreground">{editing.id ? "Edit" : "Add"} Announcement</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Summary" value={editing.summary || ""} onChange={e => setEditing({ ...editing, summary: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Full Description" rows={4} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
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
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={editing.is_featured || false} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} className="rounded" /> Featured
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={save} disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Featured</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-card-foreground">{item.title}</td>
                <td className="px-4 py-3">{item.is_featured ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Yes</span> : <span className="text-muted-foreground text-xs">No</span>}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="mr-2 text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No announcements yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
