import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { Menu } from "lucide-react";
import { Link } from "react-scroll";
import logo from "@/assets/icons/logo.svg";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: "About", label: "About" },
    { id: "use-cases", label: "Use Cases" },
    { id: "solutions", label: "Solutions" },
    { id: "resources", label: "Resources" },
    { id: "integrations", label: "Integrations" },
    { id: "Enterprise", label: "Enterprise" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          scrolling ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-8 lg:px-12">
          <a href="#" className="text-xl font-bold text-black">
            <img src={logo} alt="AutomateRFP logo" width="80" height="40" />{" "}
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.id}
                  smooth
                  duration={500}
                  className="cursor-pointer hover:text-blue-600 transition-colors text-sm font-medium"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" className="text-sm">
              Login
            </Button>
            <Button className="text-sm">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <ul className="flex flex-col space-y-4 p-6">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.id}
                    smooth
                    duration={500}
                    className="cursor-pointer hover:text-blue-600 transition-colors text-sm font-medium"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 p-6">
              <Button variant="outline" className="w-full text-sm">
                Login
              </Button>
              <Button className="w-full text-sm">Get Started</Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
