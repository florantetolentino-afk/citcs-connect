import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import achievement1 from "@/assets/achievement-1.jpg";
import achievement2 from "@/assets/achievement-2.jpg";
import achievement3 from "@/assets/achievement-3.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const galleryItems = [
  { id: 1, image: achievement1, title: "Excellence Award Ceremony", description: "CITCS students receiving the regional IT competition trophy." },
  { id: 2, image: achievement2, title: "HackGov 2026", description: "Teams competing in the national hackathon event." },
  { id: 3, image: achievement3, title: "Research Symposium", description: "Faculty presenting innovative research findings." },
  { id: 4, image: heroBg, title: "Campus Life", description: "A vibrant day at the CITCS building." },
  { id: 5, image: achievement1, title: "Graduation Day", description: "Celebrating academic milestones together." },
  { id: 6, image: achievement2, title: "Tech Summit", description: "Industry leaders sharing insights with students." },
];

const Gallery = () => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Gallery" title="Event Gallery" description="Relive the moments that define the CITCS community." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <button
                onClick={() => setModalIndex(i)}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
        imageSrc={modalIndex !== null ? galleryItems[modalIndex].image : ""}
        title={modalIndex !== null ? galleryItems[modalIndex].title : ""}
        description={modalIndex !== null ? galleryItems[modalIndex].description : ""}
        onPrev={modalIndex !== null ? () => setModalIndex((modalIndex - 1 + galleryItems.length) % galleryItems.length) : undefined}
        onNext={modalIndex !== null ? () => setModalIndex((modalIndex + 1) % galleryItems.length) : undefined}
      />
    </main>
  );
};

export default Gallery;
