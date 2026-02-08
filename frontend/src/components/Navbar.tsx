import logo from "../images/logo.png";

const Navbar = () => {
  return (
    <header className="bg-[#0f172a] w-full">
      <nav className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-full">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-7 sm:h-8 md:h-9 w-auto"
            />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;