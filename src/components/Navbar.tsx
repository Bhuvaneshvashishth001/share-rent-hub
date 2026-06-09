import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "How it Works", path: "/#how-it-works" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Clear the local session even if the server is unavailable.
    }
    logout();
    setMobileOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/image1.png"
            alt="RentHub logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-heading font-bold text-foreground">RentHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Log In</Button></Link>
              <Link to="/register"><Button variant="default" size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {isAuthenticated ? (
                  <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />Log Out
                  </Button>
                ) : (
                  <>
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Log In</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">Sign Up</Button>
                </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
