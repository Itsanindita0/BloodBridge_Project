import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken("");
    navigate("/login");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-red-600 text-white p-4 shadow relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Brand */}
        <Link to="/" className="text-3xl font-bold text-white flex items-center">
          BloodBridge ❤️
        </Link>

        {/* Hamburger Icon (Mobile Only) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/donor" className="hover:text-gray-200">Donate</Link>
          <Link to="/receiver" className="hover:text-gray-200">Request</Link>
          <Link to="/requests" className="hover:text-gray-200">Active Requests</Link>

          {/* Right Side Authentication - Desktop */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                👤 {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-red-700 shadow-lg flex flex-col items-center py-6 space-y-4">
          <Link to="/" onClick={closeMenu} className="hover:text-gray-200 text-lg">Home</Link>
          <Link to="/donor" onClick={closeMenu} className="hover:text-gray-200 text-lg">Donate</Link>
          <Link to="/receiver" onClick={closeMenu} className="hover:text-gray-200 text-lg">Request</Link>
          <Link to="/requests" onClick={closeMenu} className="hover:text-gray-200 text-lg">Active Requests</Link>

          {!user ? (
            <div className="flex flex-col gap-3 w-full px-10">
              <Link
                to="/login"
                onClick={closeMenu}
                className="bg-white text-red-600 px-4 py-2 rounded font-semibold text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-white text-red-600 px-4 py-2 rounded font-semibold text-center"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center w-full px-10">
              <span className="font-semibold text-lg">👤 {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded font-semibold w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
