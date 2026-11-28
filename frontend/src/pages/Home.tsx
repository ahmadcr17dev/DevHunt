import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="min-h-dvh bg-bg">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Home;
