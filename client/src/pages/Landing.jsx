import { useNavigate } from "react-router-dom";
import { Sprout, UtensilsCrossed, Truck } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation */}
      <div className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0D5D56] flex items-center gap-2">
          ANNI
          <Truck size={22} className="text-[#329F5B]" strokeWidth={2} />
        </h1>
        <span className="text-sm font-semibold bg-[#E5C2C0] px-3 py-1 rounded-full text-[#2A1F2D]">
          SELECT ROLE
        </span>
      </div>

      {/* Main Content */}
      <div className="px-10 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#0D5D56] mb-4">
          Welcome to ANNI
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 mb-16">
          A cooperative-based logistics coordination platform that helps
          smallholder farmers in CALABARZON efficiently supply bulk buyers
          through route-optimized shared transport.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10">

          {/* Farmer Card */}
          <div
            onClick={() => navigate("/farmer")}
            className="cursor-pointer w-80 bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100"
          >
            <div className="mb-6 flex justify-center">
              <Sprout size={48} className="text-[#329F5B]" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-[#329F5B] mb-2">
              Farmer
            </h3>
            <p className="text-gray-600 text-sm">
              Log harvests, join cooperative clusters, and coordinate shared
              transport.
            </p>
          </div>

          {/* Restaurant Card */}
          <div
            onClick={() => navigate("/restaurant")}
            className="cursor-pointer w-80 bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100"
          >
            <div className="mb-6 flex justify-center">
              <UtensilsCrossed size={48} className="text-[#329F5B]" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-[#329F5B] mb-2">
              Restaurant
            </h3>
            <p className="text-gray-600 text-sm">
              Source bulk produce directly from aggregated farmer supply
              networks.
            </p>
          </div>

          {/* Transporter Card */}
          <div
            onClick={() => navigate("/transporter")}
            className="cursor-pointer w-80 bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100"
          >
            <div className="mb-6 flex justify-center">
              <Truck size={48} className="text-[#329F5B]" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-[#329F5B] mb-2">
              Transporter
            </h3>
            <p className="text-gray-600 text-sm">
              View confirmed deliveries, follow optimized routes, and manage transport operations.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Landing;