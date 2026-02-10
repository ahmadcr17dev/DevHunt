import Lottie from "lottie-react";
import lottie1 from "../images/lottie1.json";

interface Props {
  message?: string;
  className?: string; // ✅ add this
}

const Loader: React.FC<Props> = () => {
  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center z-50`}
    >
      <Lottie
        animationData={lottie1}
        loop={true}
        className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px]"
      />
    </div>
  );
};

export default Loader;