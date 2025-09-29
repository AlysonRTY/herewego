import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/aboutMe", label: "About" },
    { href: "/duckFacts", label: "Duck Facts" },
    { href: "/skills", label: "Skills" },
    { href: "/react-demos", label: "React Demos" },
    { href: "/memory-game", label: "Memory Game 🎮" },
    { href: "/contact", label: "Contact" },
    { href: "/berlin-time", label: "Berlin Time" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
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
            <Link to="/contact">Contact</Link>
          </Button>
          <Button size="sm">Resume</Button>
        </div>
      </div>
    </nav>
  );
}
