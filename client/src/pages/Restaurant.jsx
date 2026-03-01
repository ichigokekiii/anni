/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Map from "../components/Map";
import { Truck, CheckCircle } from "lucide-react";

function Restaurant() {
  const navigate = useNavigate();

  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const restaurantLocation = {
    lat: 14.5995,
    lng: 120.9842,
  };

  const fetchClusters = async () => {
    try {
      const res = await axios.get("http://localhost:5050/clusters");
      setClusters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const placeOrder = async () => {
    if (!selected || !quantityNeeded) return;

    try {
      const res = await axios.post("http://localhost:5050/order", {
        crop: selected.crop,
        city: selected.city,
        quantityNeeded: Number(quantityNeeded),
      });

      setOrderResult(res.data);

      // Refresh clusters to reflect reduced quantities
      await fetchClusters();

      // Show success modal (do NOT reset map yet)
      setShowOrderModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

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
            RESTAURANT VIEW
          </span>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-semibold text-[#0D5D56] hover:text-[#329F5B] transition"
          >
            ← Back to Landing
          </button>
        </div>
      </div>


      <div className="px-10 py-10 grid lg:grid-cols-3 gap-10">

        {/* LEFT: Large Map */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#0D5D56] mb-6">
            Regional Supply Map
          </h2>
          <Map
            farmers={
              selected
                ? selected.farmers.map((f) => ({
                    lat: Number(f.lat),
                    lng: Number(f.lng),
                  }))
                : []
            }
            restaurant={selected ? restaurantLocation : null}
          />
        </div>

        {/* RIGHT: Clusters + Order */}
        <div className="space-y-8">

          {/* Available Clusters */}
          <div>
            <h2 className="text-2xl font-bold text-[#0D5D56] mb-6">
              Available Supply Clusters
            </h2>

            <div className="space-y-4">
              {clusters.map((cluster, index) => (
                <div
                  key={index}
                  onClick={() => setSelected(cluster)}
                  className={`cursor-pointer bg-white p-6 rounded-2xl shadow border transition ${
                    selected === cluster
                      ? "border-[#329F5B]"
                      : "border-gray-100"
                  }`}
                >
                  <h3 className="text-xl font-semibold text-[#329F5B]">
                    {cluster.crop}
                  </h3>
                  <p className="text-gray-600">
                    {cluster.totalQuantity} kg Available — {cluster.city}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Panel (Only shows when cluster selected) */}
          {selected && (
            <div className="bg-white p-8 rounded-2xl shadow space-y-6">
              <div>
                <p className="text-sm text-gray-500">Selected Cluster</p>
                <p className="font-semibold">
                  {selected.crop} — {selected.city}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Quantity Needed (kg)
                </label>
                <input
                  type="number"
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#329F5B]"
                />
              </div>

              <button
                onClick={placeOrder}
                className="w-full bg-[#329F5B] text-white py-3 rounded-lg font-semibold hover:bg-[#0C8346]"
              >
                Confirm Order
              </button>

              {orderResult && (
                <div className="bg-[#8FD5A6] bg-opacity-40 p-4 rounded-lg">
                  <p className="font-semibold text-[#0D5D56]">
                    Order Matched Successfully!
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Farmers involved: {orderResult.order.farmers.length}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
      {/* Order Success Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[380px] text-center">
            <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
              <span className="flex items-center justify-center gap-2">
                Order Accepted
                <CheckCircle size={20} className="text-[#329F5B]" strokeWidth={2} />
              </span>
            </h3>
            <p className="text-gray-600 mb-6">
              Your bulk order has been successfully placed and is now being processed.
            </p>
            <button
              onClick={() => {
                setShowOrderModal(false);
                setSelected(null); // Reset map
                setQuantityNeeded("");
              }}
              className="w-full bg-[#329F5B] text-white py-3 rounded-lg font-semibold hover:bg-[#0C8346] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Restaurant;