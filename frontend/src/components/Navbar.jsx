import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      setLoading(false);
      navigate("/login", { replace: true });
    }, 2000);
  };

  return (
    <>
      {loading && <Loading text="Logging out..." />}

      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled
          ? "bg-gray-900/80 backdrop-blur-lg border-b border-gray-800"
          : "bg-gray-900/40 backdrop-blur-sm"
          }`}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              <MdOutlineLibraryBooks className="text-black" />
            </div>
            <div className="text-lg font-semibold mx-2">Smart Notes</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <button className="text-sm text-gray-300 hover:text-white transition" disabled={loading} onClick={() => navigate("/about")}>
              About
            </button>
            <button
              className="text-sm text-gray-300 hover:text-white transition flex items-center gap-2"
              onClick={handleLogout}
              disabled={loading}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition"
            onClick={() => setMenuOpen(!menuOpen)}
            disabled={loading}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 border-t border-gray-800 backdrop-blur-lg px-6 py-3 space-y-2 transition-all duration-300">
            <button
              className="block w-full text-left text-sm text-gray-300 hover:text-white transition"
              onClick={() => {
                setMenuOpen(false);
                navigate("/about");
              }}
              disabled={loading}
            >
              About
            </button>
            <button
              className="block w-full text-left text-sm text-gray-300 hover:text-white transition"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              disabled={loading}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
