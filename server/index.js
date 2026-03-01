const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

/*
  Temporary In-Memory Storage
*/
let harvests = [];
let orders = [];

/*
  1️⃣ Add Harvest
*/
app.post("/harvest", (req, res) => {
  const { farmerName, crop, quantity, city, lat, lng } = req.body;

  if (!farmerName || !crop || !quantity || !city || !lat || !lng) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newHarvest = {
    id: harvests.length + 1,
    farmerName,
    crop,
    quantity: Number(quantity),
    city,
    lat,
    lng,
  };

  harvests.push(newHarvest);

  res.json({ message: "Harvest added", data: newHarvest });
});

/*
  2️⃣ Generate Clusters (Crop + City)
*/
app.get("/clusters", (req, res) => {
  const grouped = {};

  harvests.forEach((h) => {
    const key = `${h.crop}-${h.city}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const freshClusters = Object.keys(grouped).map((key) => {
    const farmers = grouped[key];
    const totalQuantity = farmers.reduce(
      (sum, f) => sum + f.quantity,
      0
    );

    return {
      crop: farmers[0].crop,
      city: farmers[0].city,
      totalQuantity,
      farmers,
    };
  });

  res.json(freshClusters);
});

/*
  3️⃣ Place Order
*/
app.post("/order", (req, res) => {
  const { crop, city, quantityNeeded } = req.body;

  // Recalculate clusters fresh
  const grouped = {};

  harvests.forEach((h) => {
    const key = `${h.crop}-${h.city}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const freshClusters = Object.keys(grouped).map((key) => {
    const farmers = grouped[key];
    const totalQuantity = farmers.reduce(
      (sum, f) => sum + f.quantity,
      0
    );

    return {
      crop: farmers[0].crop,
      city: farmers[0].city,
      totalQuantity,
      farmers,
    };
  });

  const cluster = freshClusters.find(
    (c) => c.crop === crop && c.city === city
  );

  if (!cluster) {
    return res.status(400).json({ message: "Cluster not found" });
  }

  if (cluster.totalQuantity < quantityNeeded) {
    return res.status(400).json({ message: "Not enough supply" });
  }

  // Deduct quantities from harvests
  let remaining = quantityNeeded;

  cluster.farmers.forEach((farmer) => {
    if (remaining <= 0) return;

    const harvest = harvests.find((h) => h.id === farmer.id);
    if (!harvest) return;

    if (harvest.quantity <= remaining) {
      remaining -= harvest.quantity;
      harvest.quantity = 0;
    } else {
      harvest.quantity -= remaining;
      remaining = 0;
    }
  });

  // Remove empty harvests
  harvests = harvests.filter((h) => h.quantity > 0);

  const newOrder = {
    id: orders.length + 1,
    crop,
    city,
    quantityNeeded,
    farmers: cluster.farmers,
    status: "pending",
  };

  orders.push(newOrder);

  res.json({
    message: "Order matched successfully",
    order: newOrder,
  });
});

// Farmer side: fetch orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Transporter side: fetch confirmed deliveries only
app.get("/transporter/orders", (req, res) => {
  const confirmed = orders.filter((o) => o.status === "confirmed");
  res.json(confirmed);
});

/*
  5️⃣ Confirm Order
*/
app.post("/order/confirm/:id", (req, res) => {
  const { id } = req.params;

  const order = orders.find((o) => o.id === Number(id));

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "confirmed";

  res.json({
    message: "Order confirmed successfully",
    order,
  });
});

// Transporter earnings summary
app.get("/transporter/earnings", (req, res) => {
  const confirmed = orders.filter((o) => o.status === "confirmed");

  const deliveryFeePerOrder = 6000; // static for MVP

  const totalEarnings = confirmed.length * deliveryFeePerOrder;

  res.json({
    totalDeliveries: confirmed.length,
    totalEarnings,
  });
});

/*
  4️⃣ Cost Sharing
*/
app.get("/cost/:crop/:city", (req, res) => {
  const { crop, city } = req.params;

  const grouped = {};

  harvests.forEach((h) => {
    const key = `${h.crop}-${h.city}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const freshClusters = Object.keys(grouped).map((key) => {
    const farmers = grouped[key];
    const totalQuantity = farmers.reduce(
      (sum, f) => sum + f.quantity,
      0
    );

    return {
      crop: farmers[0].crop,
      city: farmers[0].city,
      totalQuantity,
      farmers,
    };
  });

  const cluster = freshClusters.find(
    (c) => c.crop === crop && c.city === city
  );

  if (!cluster) {
    return res.status(404).json({ message: "Cluster not found" });
  }

  const transportCost = 6000;

  const breakdown = cluster.farmers.map((f) => ({
    farmerName: f.farmerName,
    contribution: (
      (f.quantity / cluster.totalQuantity) *
      transportCost
    ).toFixed(2),
  }));

  res.json({
    totalTransportCost: transportCost,
    breakdown,
  });
});

/*
  Test Route
*/
app.get("/", (req, res) => {
  res.json({ message: "ANNI Backend Running 🚜" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});