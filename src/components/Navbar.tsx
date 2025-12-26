import { Link, useLocation } from "react-router-dom";
import { Hotel, BookOpen, UtensilsCrossed, Receipt, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/rooms", label: "Rooms", icon: Hotel },
    { path: "/bookings", label: "Bookings", icon: BookOpen },
    { path: "/food", label: "Food Menu", icon: UtensilsCrossed },
    { path: "/billing", label: "Billing", icon: Receipt },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-primary shadow-elegant group-hover:scale-105 transition-smooth">
              <Hotel className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grand Luxury Hotel
              </h1>
              <p className="text-xs text-muted-foreground">Excellence in Hospitality</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={isActive ? "gradient-primary shadow-elegant" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
