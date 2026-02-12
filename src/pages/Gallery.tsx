import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("gallery" as any).select("*").order("created_at", { ascending: false });
      if (data && (data as any[]).length > 0) setItems(data as any);
    };
    fetchData();
  }, []);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Gallery" title="Event Gallery" description="Relive the moments that define the CITCS community." />

        {items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No gallery items yet. Add items from the admin panel.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <button onClick={() => setModalIndex(i)} className="group w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="aspect-video overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-card-foreground">{item.title}</h3>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={modalIndex !== null}
        onClose={() => setModalIndex(null)}
        imageSrc={modalIndex !== null ? items[modalIndex]?.image_url : ""}
        title={modalIndex !== null ? items[modalIndex]?.title : ""}
        description={modalIndex !== null ? items[modalIndex]?.description : ""}
        onPrev={modalIndex !== null ? () => setModalIndex((modalIndex - 1 + items.length) % items.length) : undefined}
        onNext={modalIndex !== null ? () => setModalIndex((modalIndex + 1) % items.length) : undefined}
      />
    </main>
  );
};

export default Gallery;
