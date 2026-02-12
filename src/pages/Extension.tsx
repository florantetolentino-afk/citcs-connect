import { useState, useEffect } from "react";
import { Globe, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";

interface ExtensionItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  activity_date: string;
}

const Extension = () => {
  const [items, setItems] = useState<ExtensionItem[]>([]);
  const [selected, setSelected] = useState<ExtensionItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("extensions" as any).select("*").order("created_at", { ascending: false });
      if (data && (data as any[]).length > 0) setItems(data as any);
    };
    fetchData();
  }, []);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Outreach" title="Extension Activities" description="CITCS community outreach programs and initiatives." />

        {items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No extension activities yet. Add activities from the admin panel.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((ext, i) => (
            <ScrollReveal key={ext.id} delay={i * 0.1}>
              <button onClick={() => setSelected(ext)} className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                {ext.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={ext.image_url} alt={ext.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4">
                    <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      <Globe size={12} /> Extension
                    </span>
                    {ext.activity_date && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={12} /> {ext.activity_date}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">{ext.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{ext.description}</p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        imageSrc={selected?.image_url || ""}
        title={selected?.title}
        description={selected?.description}
      />
    </main>
  );
};

export default Extension;
