import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#8FD5A6]">

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D5D56]/20"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">

        <h1 className="text-6xl font-bold tracking-wide text-[#0D5D56]">
          ANNI 🚜
        </h1>

        <p className="mt-4 text-lg text-[#0D5D56] max-w-xl mx-auto">
          A Cooperative-Based Logistics Platform Connecting Smallholder Farmers
          to Metro Manila Restaurants Through Route-Optimized Shared Transport.
        </p>

        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center">

          {/* Farmer Card */}
          <div
            onClick={() => navigate("/farmer")}
            className="cursor-pointer w-72 bg-white border-2 border-[#329F5B] rounded-2xl p-8 hover:scale-105 hover:bg-[#E5C2C0] transition duration-300 shadow-xl"
          >
            <div className="text-4xl mb-4">🌾</div>
            <h2 className="text-2xl font-semibold text-[#000000]">Farmer</h2>
            <p className="mt-2 text-sm text-[#0D5D56]">
              Submit harvests and join cooperative supply clusters
            </p>
          </div>

          {/* Restaurant Card */}
          <div
            onClick={() => navigate("/restaurant")}
            className="cursor-pointer w-72 bg-white border-2 border-[#329F5B] rounded-2xl p-8 hover:scale-105 hover:bg-[#E5C2C0] transition duration-300 shadow-xl"
          >
            <div className="text-4xl mb-4">🍽</div>
            <h2 className="text-2xl font-semibold text-[#000000]">Restaurant</h2>
            <p className="mt-2 text-sm text-[#0D5D56]">
              Source bulk produce from verified farmer clusters
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Landing;