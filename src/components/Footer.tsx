import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-display text-base font-bold text-primary-foreground">
                C
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                CITCS <span className="text-primary">HUB</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your centralized information and announcements platform for the College of Information Technology and Computing Sciences.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {["Gallery", "Announcements", "Research", "Organizations", "Extension"].map((link) => (
                <Link
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>CITCS Building, Main Campus</p>
              <p>citcs.hub@university.edu</p>
              <p>(+63) 912 345 6789</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CITCS HUB. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
