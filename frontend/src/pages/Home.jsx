import { useEffect, useState } from "react";
import { API_URL } from "../config"; 
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaTint } from "react-icons/fa";

export default function Home() {
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);

  useEffect(() => {
    // fetch all donors (public)
    fetch(`${API_URL}/api/donors/all`)
      .then((res) => res.json())
      .then((data) => setDonors(Array.isArray(data) ? data : []))
      .catch((err) => console.log("Donors fetch error:", err));

    // fetch all receivers (public)
    fetch(`${API_URL}/api/receivers/all`)
      .then((res) => res.json())
      .then((data) => setReceivers(Array.isArray(data) ? data : []))
      .catch((err) => console.log("Receivers fetch error:", err));
  }, []);

  // analytics
  const totalDonors = donors.length;
  const totalRequests = receivers.length;
  const fulfilled = receivers.filter((r) => r.status === "fulfilled").length;
  const pending = totalRequests - fulfilled;

  const pieData = [
    { name: "Fulfilled", value: fulfilled },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#22c55e", "#ef4444"];
  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  const barData = bloodGroups.map((bg) => ({
    bloodGroup: bg,
    count: receivers.filter((r) => r.bloodGroupNeeded === bg).length,
  }));

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=60")`,
        }}
      >
        <div className="bg-black/50 w-full h-full py-28 px-6 md:px-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Donate <span className="text-red-500">Blood</span>, Save{" "}
            <span className="text-red-500">Lives</span> ❤️
          </h1>
          <p className="text-lg max-w-2xl">
            Your small act of kindness can give someone a second chance at life.
          </p>

          <div className="mt-6 flex gap-4">
            <a href="/donor">
              <button className="bg-red-600 hover:bg-red-700 px-6 py-3 font-bold rounded text-white">
                Become a Donor
              </button>
            </a>
            <a href="/receiver">
              <button className="bg-gray-200 hover:bg-gray-300 px-6 py-3 font-bold rounded text-black">
                Request Blood
              </button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            <div className="bg-white/90 rounded-xl shadow p-6 text-center text-red-600 font-bold">
              <p className="text-4xl">500k+</p>
              <p>Lives Saved</p>
            </div>
            <div className="bg-red-500 rounded-xl shadow p-6 text-center text-white font-bold">
              <p className="text-4xl">50k+</p>
              <p>Active Donors</p>
            </div>
            <div className="bg-gray-900 rounded-xl shadow p-6 text-center text-white font-bold">
              <p className="text-4xl">24/7</p>
              <p>Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-4xl font-bold text-center text-red-600 flex justify-center gap-3">
          <FaTint className="text-red-500" /> BloodBridge Analytics
        </h2>

        {/* Stats Cards dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="font-semibold">Total Donors</h3>
            <p className="text-3xl font-bold text-blue-600">{totalDonors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="font-semibold">Total Requests</h3>
            <p className="text-3xl font-bold text-purple-600">
              {totalRequests}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="font-semibold">Fulfilled</h3>
            <p className="text-3xl font-bold text-green-600">{fulfilled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h3 className="font-semibold">Pending</h3>
            <p className="text-3xl font-bold text-red-600">{pending}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-center mb-3 text-gray-600">
              Request Fulfillment Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={120}>
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-center mb-3 text-gray-600">
              Blood Group Demand
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="bloodGroup" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT REQUESTS */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-20 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          📝 Latest Requests
        </h2>
        {receivers.length === 0 && (
          <p className="text-gray-500">No requests yet...</p>
        )}

        {receivers
          .slice(-5)
          .reverse()
          .map((r) => (
            <div key={r._id} className="border-b py-3">
              <strong>{r.name}</strong> needs
              <span className="text-red-600 font-semibold">
                {" "}
                {r.bloodGroupNeeded}{" "}
              </span>
              in {r.city} — ({r.status})
            </div>
          ))}
      </div>
    </div>
  );
}
