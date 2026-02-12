import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Item {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const empty: Omit<Item, "id"> = { title: "", description: "", image_url: "" };

const AdminGallery = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("gallery" as any).select("*").order("created_at", { ascending: false });
    setItems((data as any) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    if (!editing?.title) return;
    setLoading(true);
    const payload = { title: editing.title, description: editing.description, image_url: editing.image_url } as any;
    if (editing.id) {
      await supabase.from("gallery" as any).update(payload).eq("id", editing.id);
    } else {
      await supabase.from("gallery" as any).insert(payload);
    }
    setEditing(null);
    setLoading(false);
    fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    await supabase.from("gallery" as any).delete().eq("id", id);
    fetchData();
  };

  const uploadImage = async (file: File) => {
    const path = `gallery/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) return "";
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    return data.publicUrl;
  };

  if (!isAdmin) return <div className="text-muted-foreground">You need admin access.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Gallery</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:scale-105 transition-transform">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-card-foreground">{editing.id ? "Edit" : "Add"} Gallery Item</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Description" rows={3} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {item.image_url && <img src={item.image_url} alt={item.title} className="aspect-video w-full object-cover" />}
            <div className="p-4">
              <h3 className="font-display text-sm font-semibold text-card-foreground">{item.title}</h3>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(item)} className="text-muted-foreground hover:text-primary"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">No gallery items yet.</div>}
      </div>
    </div>
  );
};

export default AdminGallery;
