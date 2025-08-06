import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/aboutMe", label: "About" },
    { href: "/duckFacts", label: "Duck Facts" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
            <span className="text-sm font-bold text-white dark:text-slate-900">
              M
            </span>
          </div> */}
          <span className="font-bold text-xl">Max</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Contact
          </Button>
          <Button size="sm">Resume</Button>
        </div>
      </div>
    </nav>
  );
}
