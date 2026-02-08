import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CopyRight from "../components/CopyRight";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Centered Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <HeroSection />
      </main>

      <CopyRight />
    </div>
  );
};

export default Home;