import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CopyRight from "../components/CopyRight";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <CopyRight />
    </div>
  );
};

export default Home;
