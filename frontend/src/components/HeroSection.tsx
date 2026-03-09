import logo1 from "../images/logo1.png";
import { NavLink } from "react-router-dom";
import Loader from "./Loader";
import { useEffect, useState } from "react";

const HeroSection = () => {
    const [loading, setLoading] = useState(true);

    // load loader on page load
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, [])

    return (
        <>
            {loading && <Loader />}

            {/* 
                1. Section Background is now pure white (bg-white).
                2. Gradient is contained inside the 'gradient-bg' div.
                3. 'gradient-bg' is centered and limited to max-w-4xl, 
                   so the left/right edges of the screen remain white.
            */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">

                {/* Gradient Background Container (Behind Content) */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/60 to-white w-full max-w-4xl mx-auto"></div>

                {/* Decorative Blobs (Optional - keeps the modern feel) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center animate-fade-in-up">

                    {/* Logo */}
                    <div className="mb-8 transition-all duration-700 ease-out transform hover:scale-105">
                        <img
                            src={logo1}
                            alt="Company Logo"
                            className="w-[260px] sm:w-[360px] md:w-[450px] lg:w-[600px] h-auto object-contain drop-shadow-lg"
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 mb-4">
                        Let's Kickstart Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Career</span> Here
                    </h1>

                    {/* Subtext */}
                    <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                        Create an account or sign in to see your personalized job recommendations tailored just for you.
                    </p>

                    {/* Button */}
                    <NavLink
                        to="/login"
                        className="group mt-10 sm:mt-12 px-8 sm:px-10 md:px-12 py-4 bg-indigo-600 text-white font-semibold text-lg border border-transparent rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                        <span className="flex items-center gap-2">
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </NavLink>
                </div>
            </section>
        </>
    );
};

export default HeroSection;