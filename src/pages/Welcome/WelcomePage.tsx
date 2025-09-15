import { Link } from "react-router";
import frontBg from '../../../public/images/front_bg.jpg'

const WelcomePage = () => {
  return (
    <div
      className="text-xl text-white h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('../../../public/images/front_bg.jpg')" }}
    >
      <div className="text-center px-4 z-10 backdrop-blur-2xl w-full h-full flex items-center justify-center flex-col gap-5">
        <p className="text-3xl md:text-5xl lg:text-7xl font-bold lg:w-[1025px] mx-auto">
          Welcome to Extra Handen’s <br />
          <span>AI tool</span>
        </p>

        {/* Responsive Button */}
        <div className="flex justify-center mt-6">
          <Link
            to="/login"
            className="btn flex items-center justify-between px-4 py-2 w-40 sm:w-60 md:w-72 lg:w-[265px] h-10 sm:h-12 md:h-16 lg:h-[68px] rounded-full bg-white hover:bg-gray-200 transition-colors"
          >
            <span className="text-base sm:text-lg md:text-xl lg:text-xl text-black font-semibold">
              Continue
            </span>
            <img
              src="/images/rightIcons.png"
              alt="Right Icon"
              className="w-6 bg-[#13072E] sm:w-8 md:w-10 lg:w-12 h-6 sm:h-8 md:h-10 lg:h-12 rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;