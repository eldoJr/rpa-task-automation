import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { Menu } from "lucide-react";
import { Link } from "react-scroll";
import "@/assets/styles/navbar.css"

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
    { id: "use-cases", label: "Use Cases" },
    { id: "solutions", label: "Solutions" },
    { id: "resources", label: "Resources" },
    { id: "integrations", label: "Integrations" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          scrolling ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <a href="#" className="text-xl font-bold text-black">
            Logo.
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.id}
                  smooth
                  duration={500}
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <Button variant="outline">Login</Button>
            <Button>Get Started</Button>
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
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 p-6">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Header Section */}
      <header className="w-full text-center py-36 bg-gray-50">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-black">
            Automate Repetitive Tasks,{" "}
            <br />
            &<span className="text-blue-600"> Create RFPs in Minutes.</span>
          </h1>
          <p className="mt-4 text-gray-600">
            Automate manual tasks and free up your team to focus on strategic work
          </p>
          <Button className="mt-6">Get Started</Button>
        </div>
      </header>
    </>
  );
};

export default Navbar;