import logo1 from "../images/logo1.png";
import { NavLink } from "react-router-dom";

const HeroSection = () => {
    return (
        <>
            <section className="text-center flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <img
                    src={logo1}
                    alt="Logo1"
                    className="w-[260px] sm:w-[360px] md:w-[450px] lg:w-[600px] mb-6"
                />

                <span className="font-medium text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px]">
                    Let's Kickstart Your Career Here
                </span>

                <p className="mt-3 max-w-xl text-sm sm:text-base md:text-lg text-gray-600">
                    Create an account or sign in to see your personalised job recommendations.
                </p>

                <NavLink
                    to="/login"
                    className="mt-8 sm:mt-10 px-8 sm:px-10 md:px-12 py-3 bg-[#004fcb] text-white font-medium border rounded-md hover:cursor-pointer hover:bg-[#002970] transition duration-500">
                    Get Started
                </NavLink>
            </section>
        </>
    );
};

export default HeroSection;