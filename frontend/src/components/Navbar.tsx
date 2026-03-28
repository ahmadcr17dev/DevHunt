// Navbar.tsx - UPDATED
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAuth } from '../context/AuthContext'
import logo from "../images/logo.png";

const Navbar = () => {
  const { user } = useAuth(); // 🔥 Get user state!

  return (
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
                <NavLink
                  to="/logout"
                  className="rounded-xl transition-all duration-300 group hover:cursor-pointer"
                >
                  <RiLogoutCircleRLine size={20} color={"white"} className="mx-1 group-hover:rotate-180 transition-transform duration-300" />
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
                <FaUserCircle size={24} />
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;