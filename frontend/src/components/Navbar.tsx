import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAuth } from '../context/AuthContext'
import logo from "../images/logo.png";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth(); // 🔥 Get user state!
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const navigate = useNavigate();

  const ConfirmLogOut = () => {
    logout();
    setShowConfirmPanel(false);
    navigate("/login", { replace: true });
  }

  const CancelLogOut = () => {
    setShowConfirmPanel(false);
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md shadow-lg border-b border-white/10">
        <nav className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <NavLink to="/" className="-m-1.5 p-1.5 flex items-center group transition-all duration-300 hover:scale-105">
              <img
                src={logo}
                alt="Logo"
                className="h-7 sm:h-8 md:h-9 w-auto transition-all duration-300 group-hover:drop-shadow-lg"
              />
            </NavLink>
          </div>

          {/* 🔥 AUTH STATE AWARE NAVBAR */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Logged IN
              <>
                <span className="text-white text-sm font-medium hidden md:block">
                  {user.username}
                </span>
                <div className="flex items-center space-x-2">
                  <NavLink
                    to="/profile"
                    className="text-white hover:text-gray-300 transition-colors p-1"
                    title="Profile"
                  >
                    <FaUserCircle size={20} className="mx-1" />
                  </NavLink>
                  <button
                    onClick={() => setShowConfirmPanel(true)}
                    className="rounded-xl transition-all duration-300 group hover:cursor-pointer"
                  >
                    <RiLogoutCircleRLine size={20} color={"white"} className="mx-1 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                </div>
              </>
            ) : (
              // Logged OUT
              <>
                <NavLink
                  to="/login"
                  className="text-white hover:text-gray-300 transition-colors p-1"
                  title="Login"
                >
                  <FaUserCircle size={24} />
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Confirmation Panel */}
      {showConfirmPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center transform transition-all duration-300 scale-100 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <FiLogOut className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-900">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              You will be logged out of your account.
            </p>
            <div className="flex justify-around gap-3">
              <button
                onClick={ConfirmLogOut}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 hover:cursor-pointer"
              >
                Yes, Logout
              </button>
              <button
                onClick={CancelLogOut}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;