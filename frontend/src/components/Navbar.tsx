import logo from "../images/logo.png";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md shadow-lg border-b border-white/10">
      <nav className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="-m-1.5 p-1.5 flex items-center group transition-all duration-300 hover:scale-105"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-7 sm:h-8 md:h-9 w-auto transition-all duration-300 group-hover:drop-shadow-lg"
            />
          </a>
        </div>

        {/* Right side placeholder for future links (optional) */}
        <div className="flex lg:flex-1 justify-end">
          {/* Add navigation links here in the future */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;