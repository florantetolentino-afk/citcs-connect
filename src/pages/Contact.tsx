import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "CITCS Building, Main Campus, University Avenue" },
  { icon: Phone, label: "Phone", value: "(+63) 912 345 6789" },
  { icon: Mail, label: "Email", value: "citcs.hub@university.edu" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri, 8:00 AM – 5:00 PM" },
];

const Contact = () => {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading badge="Reach Us" title="Contact" description="Have questions? We're here to help." />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-card-foreground">{item.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Map placeholder */}
          <ScrollReveal delay={0.2}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802548767!2d121.0!3d14.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM2JzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CITCS Location"
                className="w-full"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
};

export default Contact;
