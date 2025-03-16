import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/icons/logo.svg";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Bloquear rolagem quando o menu mobile estiver aberto
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null); // Fechar dropdowns ao fechar o menu móvel
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const navLinks = [
    {
      id: "about",
      label: "About",
      hasDropdown: true,
      dropdownItems: [
        { id: "our-story", label: "Our Story" },
        { id: "team", label: "Our Team" },
        { id: "careers", label: "Careers" },
      ],
    },
    {
      id: "use-cases",
      label: "Use Cases",
      hasDropdown: true,
      dropdownItems: [
        { id: "startups", label: "Startups" },
        { id: "enterprise", label: "Enterprise" },
        { id: "developers", label: "Developers" },
      ],
    },
    { id: "solutions", label: "Solutions" },
    { id: "resources", label: "Resources" },
    { id: "integrations", label: "Integrations" },
    { id: "enterprise", label: "Enterprise" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 cursor-pointer ${
          scrolling
            ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-10 lg:px-28">
          <a href="#" className="flex items-center z-50 relative">
            <img
              src={logo}
              alt="logo"
              className="w-10 h-8 lg:w-24 lg:h-14 transition-all duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className="relative group"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.id)}
                  onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={link.id}
                    smooth
                    duration={500}
                    className="px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-md group-hover:bg-gray-50"
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className="ml-1 transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {link.hasDropdown && (
                    <div
                      className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 transform origin-top-left ${
                        activeDropdown === link.id
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
                    >
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.id}
                          smooth
                          duration={500}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <Button
                variant="outline"
                className="text-sm font-medium px-4 py-2 transition-all hover:bg-gray-50"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 z-50 relative focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-900" />
            ) : (
              <Menu size={24} className={scrolling ? "text-gray-900" : "text-gray-900"} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="w-10 h-8" />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="space-y-1 pt-4">
            {navLinks.map((link) => (
              <li key={link.id} className="py-1">
                {link.hasDropdown ? (
                  <div className="space-y-1">
                    <button
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-50"
                      onClick={() => toggleDropdown(link.id)}
                    >
                      <span className="font-medium">{link.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transform transition-transform duration-200 ${
                          activeDropdown === link.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    <div
                      className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        activeDropdown === link.id ? "max-h-60" : "max-h-0"
                      }`}
                    >
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.id}
                          smooth
                          duration={500}
                          className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.id}
                    smooth
                    duration={500}
                    className="block px-3 py-2 font-medium text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="pt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center text-base py-2.5"
              onClick={() => {
                navigate("/login");
                closeMobileMenu();
              }}
            >
              Login
            </Button>
            <Button
              className="w-full justify-center text-base py-2.5 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                navigate("/register");
                closeMobileMenu();
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;