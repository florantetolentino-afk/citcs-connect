import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  created_at: string;
}

const Announcements = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("announcements" as any).select("*").order("created_at", { ascending: false });
      if (data && (data as any[]).length > 0) setItems(data as any);
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Updates" title="Announcements" description="All the latest news, events, and updates from CITCS." />

        {items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No announcements yet. Add announcements from the admin panel.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 0.08}>
              <button
                onClick={() => { setSelected(a); setModalOpen(true); }}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {a.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={a.image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{formatDate(a.created_at)}</span>
                  <h3 className="mb-2 font-display text-base font-semibold text-card-foreground">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={selected?.image_url || ""}
        title={selected?.title}
        description={selected?.description}
      />
    </main>
  );
};

export default Announcements;
