const CopyRight = () => {
  return (
    <footer className="w-full border-t border-border bg-surface py-4">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted sm:px-6 sm:text-sm">
        &copy; {new Date().getFullYear()} DevHunt. All rights reserved.
      </div>
    </footer>
  );
};

export default CopyRight;
