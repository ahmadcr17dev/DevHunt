import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { HiOutlineDocument } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext'
import logo from "../images/logo.png";
import { FiBookmark, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout, getSavedJobCount } = useAuth(); // 🔥 Get user state!
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setSavedCount(0);
      return;
    }

    getSavedJobCount(user.username).then(count => setSavedCount(count));
  }, [user, getSavedJobCount])

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
                    title="LogOut"
                  >
                    <RiLogoutCircleRLine size={20} color={"white"} className="mx-1 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <button
                    className="rounded-xl transition-all duration-300 group hover:cursor-pointer"
                    title="Applied Jobs"
                  >
                    <HiOutlineDocument size={18} color={"white"} className="mx-1 transition-transform duration-300" />
                  </button>
                  {/* Saved Jobs Badge */}
                  <NavLink to="/saved-jobs" className="relative p-2">
                    <FiBookmark className="w-6 h-6 text-slate-400 hover:text-white" />

                    {savedCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                        {savedCount > 99 ? '99+' : savedCount}
                      </span>
                    )}
                  </NavLink>
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
                  <FaUserCircle size={20} />
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Confirmation Panel */}
      {showConfirmPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all duration-300 scale-100 animate-in fade-in zoom-in duration-200">

            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center backdrop-blur-sm">
              <FiLogOut className="w-10 h-10 text-red-400" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Are you sure?
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-sm mx-auto">
              You will be logged out of your account.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={ConfirmLogOut}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-semibold shadow-xl shadow-red-500/30 hover:from-red-700 hover:to-rose-700 hover:shadow-red-500/50 hover:-translate-y-1 transition-all duration-300 border border-red-500/20 hover:cursor-pointer"
              >
                Yes, Logout
              </button>
              <button
                onClick={CancelLogOut}
                className="flex-1 px-6 py-4 bg-slate-700/50 text-slate-300 rounded-2xl font-semibold border border-slate-600/50 hover:bg-slate-700 hover:text-white hover:border-slate-500/50 transition-all duration-300 hover:cursor-pointer backdrop-blur-sm"
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