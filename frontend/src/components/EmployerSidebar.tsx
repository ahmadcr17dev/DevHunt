import { NavLink, useNavigate, useLocation } from "react-router-dom"
import logo from "../images/logo.png";
import {
    FiHome,
    FiPlusSquare,
    FiEdit,
    FiBarChart2,
    FiLogOut,
    FiMenu,
    FiUser,
} from "react-icons/fi"
import { useState } from "react"
import { useAuth } from "../context/AuthContext";

const navItems = [
    { name: "Overview", path: "/employer", icon: FiHome },
    { name: "Post a Job", path: "/employer/createjob", icon: FiPlusSquare },
    { name: "Update Jobs", path: "/employer/updatejobs", icon: FiEdit },
    { name: "Statistics", path: "/employer/statistics", icon: FiBarChart2 },
    { name: "My Account", path: "/employer/myaccount", icon: FiUser }
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
        if (path === "/employer") {
            return location.pathname === "/employer"
        }
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 text-white bg-slate-800 p-2 rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-200 hover:cursor-pointer"
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
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group hover:cursor-pointer"
                    >
                        <FiLogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

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
    )
}

export default EmployerSidebar;