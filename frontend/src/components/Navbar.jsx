import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="bg-red-600 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand */}
        <Link to="/" className="text-3xl font-bold text-white">
          BloodBridge ❤️
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/donor" className="hover:text-gray-200">Donate</Link>
          <Link to="/receiver" className="hover:text-gray-200">Request</Link>
          <Link to="/requests" className="hover:text-gray-200">Active Requests</Link>

          {/* Right Side Authentication */}
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
    </nav>
  );
}
