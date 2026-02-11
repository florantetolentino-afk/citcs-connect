import { useState, useMemo } from "react";
import { FileText, Filter } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

interface ResearchItem {
  id: number;
  title: string;
  abstract: string;
  program: "BSIT" | "BSOA";
  role: "Faculty" | "Student";
  type: "Capstone" | "Thesis";
  year: string;
  status: "Approved" | "Pending";
  adviser?: string;
}

const researchData: ResearchItem[] = [
  { id: 1, title: "AI-Powered Campus Navigation System", abstract: "A mobile-based campus navigation system leveraging AI for optimal route planning and accessibility features.", program: "BSIT", role: "Student", type: "Capstone", year: "2026", status: "Approved", adviser: "Dr. Santos" },
  { id: 2, title: "Blockchain-Based Document Verification", abstract: "Implementing blockchain technology for secure and transparent academic document verification.", program: "BSIT", role: "Faculty", type: "Thesis", year: "2025", status: "Approved", adviser: "Prof. Reyes" },
  { id: 3, title: "Digital Records Management System", abstract: "A comprehensive digital solution for office records management and document tracking.", program: "BSOA", role: "Student", type: "Capstone", year: "2026", status: "Pending", adviser: "Ms. Cruz" },
  { id: 4, title: "IoT-Based Smart Classroom Monitoring", abstract: "Real-time monitoring of classroom conditions using IoT sensors for improved learning environments.", program: "BSIT", role: "Student", type: "Thesis", year: "2025", status: "Approved", adviser: "Dr. Garcia" },
  { id: 5, title: "E-Governance Administrative Portal", abstract: "A web-based portal for streamlining administrative processes in local government offices.", program: "BSOA", role: "Faculty", type: "Thesis", year: "2026", status: "Approved", adviser: "Dr. Lim" },
  { id: 6, title: "Machine Learning for Student Performance Prediction", abstract: "Utilizing ML algorithms to predict student academic performance based on behavioral patterns.", program: "BSIT", role: "Faculty", type: "Thesis", year: "2026", status: "Approved", adviser: "Dr. Santos" },
];

const Research = () => {
  const [program, setProgram] = useState<string>("All");
  const [role, setRole] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [year, setYear] = useState<string>("All");

  const filtered = useMemo(() => {
    return researchData.filter((r) => {
      if (program !== "All" && r.program !== program) return false;
      if (role !== "All" && r.role !== role) return false;
      if (type !== "All" && r.type !== type) return false;
      if (year !== "All" && r.year !== year) return false;
      return true;
    });
  }, [program, role, type, year]);

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Academic" title="Research & Thesis" description="Browse faculty and student research outputs with dynamic filtering." />

        {/* Filters */}
        <ScrollReveal>
          <div className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Filter size={16} /> Filters
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <FilterSelect label="Program" value={program} onChange={setProgram} options={["All", "BSIT", "BSOA"]} />
              <FilterSelect label="Role" value={role} onChange={setRole} options={["All", "Faculty", "Student"]} />
              <FilterSelect label="Type" value={type} onChange={setType} options={["All", "Capstone", "Thesis"]} />
              <FilterSelect label="Year" value={year} onChange={setYear} options={["All", "2025", "2026"]} />
            </div>
          </div>
        </ScrollReveal>

        {/* Results */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              No research found matching the selected filters.
            </div>
          )}
          {filtered.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{r.program}</span>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{r.role}</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{r.type}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${r.status === "Approved" ? "bg-primary/10 text-primary" : "bg-secondary/30 text-secondary-foreground"}`}>
                        {r.status}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-base font-semibold text-card-foreground">{r.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{r.abstract}</p>
                    {r.adviser && (
                      <p className="mt-3 text-xs text-muted-foreground">Adviser: <span className="font-medium text-card-foreground">{r.adviser}</span></p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{r.year}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <FileText size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Research;
