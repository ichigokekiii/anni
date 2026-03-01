/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Map from "../components/Map";
import { Truck, Sprout } from "lucide-react";

function Farmer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add");

  const [form, setForm] = useState({
    farmerName: "",
    crop: "",
    quantity: "",
    city: "",
  });

  const [lastHarvest, setLastHarvest] = useState(null);

  const [cluster, setCluster] = useState(null);
  const [cost, setCost] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/harvest", {
        ...form,
        lat: 14.1,
        lng: 121.2,
      });

      setLastHarvest({
        crop: form.crop,
        city: form.city,
      });

      setShowHarvestModal(true);
      setForm({ farmerName: "", crop: "", quantity: "", city: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCluster = async () => {
    try {
      const clusterRes = await axios.get("http://localhost:5050/clusters");
      setCluster(clusterRes.data || []);

      if (clusterRes.data && clusterRes.data.length > 0) {
        const first = clusterRes.data[0];
        const costRes = await axios.get(
          `http://localhost:5050/cost/${first.crop}/${first.city}`
        );
        setCost(costRes.data);
      } else {
        setCost(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5050/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBF8]">

      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-100 px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0D5D56] flex items-center gap-2">
          ANNI
          <Truck size={22} className="text-[#329F5B]" strokeWidth={2} />
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold bg-[#E5C2C0] px-3 py-1 rounded-full text-[#2A1F2D]">
            FARMER VIEW
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

        {/* Page Header */}
        <div className="mb-10 col-span-full">
          <h2 className="text-3xl font-bold text-[#0D5D56] mb-2">
            Farmer Dashboard
          </h2>
          <p className="text-[#2A1F2D] opacity-70">
            Log harvests, view your cluster, and confirm deliveries.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 col-span-full">
          {["add", "accept"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "accept") fetchOrders();
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition 
                ${
                  activeTab === tab
                    ? "bg-[#329F5B] text-white"
                    : "bg-white text-[#0D5D56]"
                }`}
            >
              {tab === "add" && "Log Harvest"}
              {tab === "accept" && "Accept Delivery"}
            </button>
          ))}
        </div>

        {/* Add Harvest */}
        {activeTab === "add" && (
          <div className="col-span-full grid lg:grid-cols-3 gap-10">

            {/* LEFT: Log Harvest Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-bold text-[#0D5D56] mb-6">
                Log Your Harvest
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="farmerName"
                  placeholder="Farmer Name"
                  value={form.farmerName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#329F5B] outline-none"
                  required
                />

                <input
                  type="text"
                  name="crop"
                  placeholder="Crop Type"
                  value={form.crop}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#329F5B] outline-none"
                  required
                />

                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity (kg)"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#329F5B] outline-none"
                  required
                />

                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#329F5B] outline-none"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Laguna">Laguna</option>
                  <option value="Quezon">Quezon</option>
                  <option value="Batangas">Batangas</option>
                </select>

                <button
                  type="submit"
                  onClick={fetchCluster}
                  className="w-full bg-[#329F5B] text-white py-3 rounded-lg font-semibold hover:bg-[#0C8346] transition"
                >
                  Add to Network
                </button>
              </form>
            </div>

            {/* RIGHT: Cluster View */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-[#0D5D56] mb-6">
                Current Supply Clusters
              </h3>

              {!cluster || cluster.length === 0 ? (
                <p className="text-gray-500">No clusters formed yet.</p>
              ) : (
                <div className="space-y-4">
                  {cluster.map((c, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-xl p-5 flex justify-between items-center hover:shadow-sm transition"
                    >
                      <div>
                        <p className="text-lg font-semibold text-[#329F5B]">
                          {c.crop}
                        </p>
                        <p className="text-sm text-gray-500">
                          {c.totalQuantity} kg Available — {c.city}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {c.farmers.length} farmers
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Accept Delivery */}
        {activeTab === "accept" && (
          <div className="col-span-full grid lg:grid-cols-3 gap-10">

            {/* Orders Panel */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-[#0D5D56] mb-6">
                Incoming Orders
              </h3>

              {orders.length === 0 ? (
                <p className="text-gray-500">No restaurant orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-xl p-5 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-[#329F5B]">
                          {order.crop} — {order.quantityNeeded} kg
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.city}
                        </p>
                        <p className="text-xs mt-1">
                          Status: {order.status}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowRoute(true);
                        }}
                        className="bg-[#329F5B] text-white px-6 py-2 rounded-lg hover:bg-[#0C8346]"
                      >
                        See More
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Route + Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              {showRoute && selectedOrder ? (
                <>
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
                      Delivery Details
                    </h3>

                    <p className="mb-2">
                      Farmers in Cluster: {selectedOrder.farmers.length}
                    </p>

                    <p className="mb-2">
                      Total Shipment: {selectedOrder.quantityNeeded} kg
                    </p>

                    {/* Simulated Transport Cost */}
                    {(() => {
                      const transportCost = 6000;
                      const perFarmer = (
                        transportCost / selectedOrder.farmers.length
                      ).toFixed(2);

                      return (
                        <>
                          <p className="mb-2 font-semibold">
                            Total Transport Cost: ₱{transportCost}
                          </p>
                          <p className="text-sm text-gray-600">
                            Per Farmer Share: ₱{perFarmer}
                          </p>
                        </>
                      );
                    })()}

                    {selectedOrder.status === "pending" && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.post(
                              `http://localhost:5050/order/confirm/${selectedOrder.id}`
                            );
                            await fetchOrders();
                            setShowModal(true);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="mt-4 w-full bg-[#329F5B] text-white py-3 rounded-lg font-semibold hover:bg-[#0C8346] transition"
                      >
                        Confirm Delivery
                      </button>
                    )}

                    {selectedOrder.status === "confirmed" && (
                      <div className="mt-4 text-[#0C8346] font-semibold">
                        Delivery Confirmed
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
                      Optimized Route Preview
                    </h3>
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <Map
                        farmers={selectedOrder.farmers.map((f) => ({
                          lat: Number(f.lat),
                          lng: Number(f.lng),
                        }))}
                        restaurant={{
                          lat: 14.5995,
                          lng: 120.9842,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-6 text-gray-500">
                  Select "See More" on an order to preview optimized route
                  and delivery breakdown.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] text-center">
            <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
              Delivery Confirmed 🚜
            </h3>
            <p className="text-gray-600 mb-6">
              You have successfully accepted the delivery.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setShowRoute(false);
                setSelectedOrder(null);
              }}
              className="w-full bg-[#329F5B] text-white py-3 rounded-lg font-semibold hover:bg-[#0C8346] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Harvest Success Modal */}
      {showHarvestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] text-center">
            <h3 className="text-xl font-bold text-[#0D5D56] mb-4">
              <span className="flex items-center justify-center gap-2">
                Harvest Logged
                <Sprout size={20} className="text-[#329F5B]" strokeWidth={2} />
              </span>
            </h3>
            <p className="text-gray-600 mb-6">
              Your harvest has been successfully added to the network.
            </p>
            <button
              onClick={() => setShowHarvestModal(false)}
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

export default Farmer;