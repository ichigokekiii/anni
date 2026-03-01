

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, MapPin } from "lucide-react";
import Map from "../components/Map";

function Transporter() {
  const navigate = useNavigate();

  // Temporary mock confirmed orders (backend later)
  const [orders] = useState([
    {
      id: 1,
      crop: "Tomato",
      city: "Laguna",
      farmers: [
        { farmerName: "Juan", lat: 14.12, lng: 121.25 },
        { farmerName: "Pedro", lat: 14.15, lng: 121.28 },
      ],
      restaurant: { lat: 14.5995, lng: 120.9842 },
      deliveryFee: 6000,
      estimatedTime: "2h 15m",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0D5D56] flex items-center gap-2">
          ANNI
          <Truck size={22} className="text-[#329F5B]" strokeWidth={2} />
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold bg-[#E5C2C0] px-3 py-1 rounded-full text-[#2A1F2D]">
            TRANSPORTER VIEW
          </span>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#0D5D56] hover:underline"
          >
            Switch Role
          </button>
        </div>
      </div>

      <div className="px-10 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT: Confirmed Orders */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#0D5D56] mb-6">
            Confirmed Deliveries
          </h2>

          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`cursor-pointer border rounded-xl p-4 mb-4 transition ${
                selectedOrder?.id === order.id
                  ? "border-[#329F5B]"
                  : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-[#329F5B]">
                {order.crop} — {order.city}
              </p>
              <p className="text-sm text-gray-500">
                {order.farmers.length} pickup points
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: Route + Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <>
              {/* Map Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <Map
                  farmers={selectedOrder.farmers.map((f) => ({
                    lat: Number(f.lat),
                    lng: Number(f.lng),
                  }))}
                  restaurant={selectedOrder.restaurant}
                />
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
                  Delivery Overview
                </h3>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">Crop:</span>{" "}
                    {selectedOrder.crop}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{" "}
                    {selectedOrder.city}
                  </p>
                  <p>
                    <span className="font-semibold">Estimated Time:</span>{" "}
                    {selectedOrder.estimatedTime}
                  </p>
                  <p>
                    <span className="font-semibold">Delivery Fee:</span> ₱
                    {selectedOrder.deliveryFee}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-gray-500">
              Select a confirmed delivery to view route and details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transporter;