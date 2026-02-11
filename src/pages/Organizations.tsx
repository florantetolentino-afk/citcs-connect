import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import achievement1 from "@/assets/achievement-1.jpg";
import achievement2 from "@/assets/achievement-2.jpg";
import achievement3 from "@/assets/achievement-3.jpg";
import heroBg from "@/assets/hero-bg.jpg";

interface Member {
  id: number;
  name: string;
  position: string;
  org: string;
  image: string;
  bio: string;
}

const members: Member[] = [
  // Faculty
  { id: 1, name: "Dr. Maria Santos", position: "Dean", org: "Faculty", image: achievement3, bio: "Dean of CITCS with over 20 years of experience in computer science education and research." },
  { id: 2, name: "Prof. Juan Reyes", position: "Department Chair - BSIT", org: "Faculty", image: heroBg, bio: "Leading the BSIT department with a focus on emerging technologies and industry partnerships." },
  { id: 3, name: "Ms. Ana Cruz", position: "Department Chair - BSOA", org: "Faculty", image: achievement3, bio: "Guiding the BSOA program towards excellence in office administration education." },
  // CITCS SC
  { id: 4, name: "Mark Dela Cruz", position: "Governor", org: "CITCS SC", image: achievement1, bio: "Leading the CITCS Student Council with initiatives for student welfare and academic excellence." },
  { id: 5, name: "Sarah Lim", position: "Vice Governor", org: "CITCS SC", image: achievement2, bio: "Supporting student government operations and inter-organizational coordination." },
  { id: 6, name: "Rico Tan", position: "Secretary", org: "CITCS SC", image: achievement1, bio: "Managing council documentation and communications." },
  // PASOA
  { id: 7, name: "Ella Reyes", position: "President", org: "PASOA", image: achievement2, bio: "Leading PASOA with a vision of professional development for OA students." },
  { id: 8, name: "Carlo Mendoza", position: "Vice President", org: "PASOA", image: achievement1, bio: "Assisting in organizational management and event planning." },
  // JPCS
  { id: 9, name: "Jose Garcia", position: "President", org: "JPCS", image: achievement2, bio: "Championing IT excellence and tech community building through JPCS." },
  { id: 10, name: "Maria Fernandez", position: "Vice President", org: "JPCS", image: achievement3, bio: "Coordinating technical workshops and industry engagement events." },
  // The Technotes
  { id: 11, name: "Ara Villanueva", position: "Editor in Chief", org: "The Technotes", image: achievement1, bio: "Leading The Technotes publication with journalistic integrity and creativity." },
  { id: 12, name: "Leo Santos", position: "Associate Editor", org: "The Technotes", image: achievement2, bio: "Overseeing editorial quality and publication standards." },
];

const orgs = ["All", "Faculty", "CITCS SC", "PASOA", "JPCS", "The Technotes"];

const Organizations = () => {
  const [activeOrg, setActiveOrg] = useState("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filtered = useMemo(() => {
    if (activeOrg === "All") return members;
    return members.filter((m) => m.org === activeOrg);
  }, [activeOrg]);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Community" title="Organizations" description="Meet the people who make CITCS a vibrant academic community." />

        {/* Tabs */}
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap gap-2">
            {orgs.map((org) => (
              <button
                key={org}
                onClick={() => setActiveOrg(org)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                  activeOrg === org
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Members Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m, i) => (
            <ScrollReveal key={m.id} delay={i * 0.05}>
              <button
                onClick={() => setSelectedMember(m)}
                className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={m.image} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className="mb-1 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{m.org}</span>
                  <h3 className="mt-2 font-display text-sm font-semibold text-card-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.position}</p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        imageSrc={selectedMember?.image || ""}
        title={`${selectedMember?.name} — ${selectedMember?.position}`}
        description={selectedMember?.bio}
      />
    </main>
  );
};

export default Organizations;
