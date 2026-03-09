import { NavLink, useNavigate, useLocation } from "react-router-dom"
import logo from "../images/logo.png";
import {
    FiHome,
    FiPlusSquare,
    FiEdit,
    FiBarChart2,
    FiLogOut,
    FiMenu,
} from "react-icons/fi"
import { useState } from "react"
import { useAuth } from "../context/AuthContext";

const navItems = [
    { name: "Overview", path: "/employer/dashboard", icon: FiHome },
    { name: "Post a Job", path: "/postjob", icon: FiPlusSquare },
    { name: "Update Jobs", path: "/employer/jobs", icon: FiEdit },
    { name: "Statistics", path: "/employer/statistics", icon: FiBarChart2 },
]

const EmployerSidebar = () => {
    const [open, setOpen] = useState(false);
    const [showConfirmPanel, setShowConfirmPanel] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const ConfirmLogOut = () => {
        logout();
        setShowConfirmPanel(false);
        navigate("/login", { replace: true });
    }

    const CancelLogOut = () => {
        setShowConfirmPanel(false);
    }

    // Helper function to check if path is active
    const isActivePath = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 text-white bg-slate-800 p-2 rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-200"
            >
                <FiMenu size={24} />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-50 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <a href="#" className="-m-1.5 p-1.5 flex items-center group transition-all duration-300 hover:scale-105">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-8 sm:h-9 md:h-10 w-auto transition-all duration-300 group-hover:drop-shadow-lg"
                        />
                    </a>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-2 p-4">
                    {navItems.map(({ name, path, icon: Icon }) => {
                        const active = isActivePath(path);
                        return (
                            <NavLink
                                key={name}
                                to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${active
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                                <span className="font-medium">{name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <button
                        onClick={() => setShowConfirmPanel(true)}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
                    >
                        <FiLogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

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
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={CancelLogOut}
                                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployerSidebar;