const CopyRight = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-xs sm:text-sm py-3 sm:py-4 w-full mt-auto">
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6">
        &copy; {new Date().getFullYear()} DevHunt. All rights reserved.
      </div>
    </footer>
  );
};

export default CopyRight;