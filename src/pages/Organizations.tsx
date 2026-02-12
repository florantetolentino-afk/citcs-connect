import { useState, useEffect, useMemo } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ImageModal from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  position: string;
  org: string;
  image_url: string;
  bio: string;
}

const defaultOrgs = ["All", "Faculty", "CITCS SC", "PASOA", "JPCS", "The Technotes"];

const Organizations = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeOrg, setActiveOrg] = useState("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("organizations" as any).select("*").order("sort_order", { ascending: true });
      if (data && (data as any[]).length > 0) setMembers(data as any);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (activeOrg === "All") return members;
    return members.filter((m) => m.org === activeOrg);
  }, [activeOrg, members]);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Community" title="Organizations" description="Meet the people who make CITCS a vibrant academic community." />

        <ScrollReveal>
          <div className="mb-10 flex flex-wrap gap-2">
            {defaultOrgs.map((org) => (
              <button key={org} onClick={() => setActiveOrg(org)} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${activeOrg === org ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-muted-foreground border border-border hover:text-foreground"}`}>
                {org}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {members.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No organization members yet. Add members from the admin panel.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m, i) => (
            <ScrollReveal key={m.id} delay={i * 0.05}>
              <button onClick={() => setSelectedMember(m)} className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="aspect-square overflow-hidden">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">{m.name[0]}</div>
                  )}
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
        imageSrc={selectedMember?.image_url || ""}
        title={`${selectedMember?.name} — ${selectedMember?.position}`}
        description={selectedMember?.bio}
      />
    </main>
  );
};

export default Organizations;
