import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="home-shell h-dvh overflow-hidden bg-bg">
      <Navbar />
      <main className="h-full">
        <HeroSection />
      </main>
    </div>
  );
};

export default Home;
