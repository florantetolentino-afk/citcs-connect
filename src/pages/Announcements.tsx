import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import achievement1 from "@/assets/achievement-1.jpg";
import achievement2 from "@/assets/achievement-2.jpg";
import achievement3 from "@/assets/achievement-3.jpg";

const announcementsList = [
  { id: 1, title: "Enrollment for 2nd Semester Now Open", summary: "Register for your courses before January 30th.", image: achievement1, fullDescription: "All CITCS students are encouraged to complete enrollment for 2nd Semester AY 2025-2026. Visit the registrar's office or use the online portal. Late enrollment incurs additional fees.", date: "Jan 15, 2026" },
  { id: 2, title: "JPCS General Assembly", summary: "Quarterly general assembly this Friday at the CITCS Auditorium.", image: achievement2, fullDescription: "The Junior Philippine Computer Society invites all members to the quarterly General Assembly. Agenda: officer reports, upcoming events, and new project announcements.", date: "Jan 20, 2026" },
  { id: 3, title: "Research Manual Updated", summary: "Latest version of the CITCS research manual now available.", image: achievement3, fullDescription: "Updated research manual includes revised formatting guidelines, new citation standards, and updated submission requirements for Capstone and Thesis papers.", date: "Jan 22, 2026" },
  { id: 4, title: "PASOA Sportsfest 2026", summary: "Annual sportsfest registration is now open for all BSOA students.", image: achievement1, fullDescription: "PASOA invites all BSOA students to register for the annual Sportsfest. Events include basketball, volleyball, badminton, and e-sports. Sign up at the PASOA office.", date: "Feb 1, 2026" },
  { id: 5, title: "Technotes Call for Submissions", summary: "Submit your articles for the next issue of The Technotes.", image: achievement2, fullDescription: "The Technotes editorial team is accepting feature articles, news stories, and opinion pieces for the upcoming issue. Deadline: February 15, 2026.", date: "Feb 5, 2026" },
];

const Announcements = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<typeof announcementsList[0] | null>(null);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Updates" title="Announcements" description="All the latest news, events, and updates from CITCS." />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcementsList.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 0.08}>
              <button
                onClick={() => { setSelected(a); setModalOpen(true); }}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{a.date}</span>
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
        imageSrc={selected?.image || ""}
        title={selected?.title}
        description={selected?.fullDescription}
      />
    </main>
  );
};

export default Announcements;
