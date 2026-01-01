import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FaTint, FaSearch } from "react-icons/fa";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [searchCity, setSearchCity] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");

  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------
     LOAD ALL REQUESTS (public)
  ----------------------------------------------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/receivers/all")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setRequests(list);
        setFilteredRequests(list);
      })
      .catch(err => console.log("Receiver fetch error:", err));
  }, []);

  /* -----------------------------------------------------
     FIND MATCHING DONORS (only for own requests)
  ----------------------------------------------------- */
  const findDonors = async (receiverId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/receivers/match/${receiverId}`);
      const data = await res.json();

      if (!data.matchingDonors) {
        alert("No matching donors found.");
        return;
      }

      setMatches(data.matchingDonors);
      setModalVisible(true);
    } 
    catch (err) {
      console.log("Find donor error:", err);
    }
  };

  /* -----------------------------------------------------
     DONATE TO A REQUEST (notify receiver)
  ----------------------------------------------------- */
  const handleDonate = async (receiverId) => {
    if (!user) {
      alert("Please login to donate ❤️");
      return navigate("/login");
    }

    const confirmDonate = window.confirm("Are you sure you want to donate?");
    if (!confirmDonate) return;

    try {
      const res = await fetch(`http://localhost:5000/api/receivers/${receiverId}/notify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        alert("Receiver has been notified! Thank you for helping ❤️");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.log("Donate error:", err);
      alert("Failed to notify receiver.");
    }
  };

  /* -----------------------------------------------------
     APPLY FILTERS
  ----------------------------------------------------- */
  const applyFilters = () => {
    let filtered = [...requests];

    if (searchCity.trim() !== "") {
      filtered = filtered.filter(r =>
        r.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (bloodGroupFilter !== "") {
      filtered = filtered.filter(r => r.bloodGroupNeeded === bloodGroupFilter);
    }

    setFilteredRequests(filtered);
  };

  const resetFilters = () => {
    setSearchCity("");
    setBloodGroupFilter("");
    setFilteredRequests(requests);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <h1 className="text-4xl font-bold text-center flex justify-center items-center gap-3 text-red-600">
        Active Blood Requests <FaTint className="text-red-500" />
      </h1>

      {/* FILTERS */}
      <div className="bg-white shadow p-4 rounded mt-6 flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Search by City"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option><option value="A-">A-</option>
          <option value="B+">B+</option><option value="B-">B-</option>
          <option value="O+">O+</option><option value="O-">O-</option>
          <option value="AB+">AB+</option><option value="AB-">AB-</option>
        </select>

        <button
          onClick={applyFilters}
          className="bg-red-600 text-white px-4 py-2 rounded w-full md:w-32 font-bold hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <FaSearch /> Filter
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-300 text-black px-3 py-2 rounded w-full md:w-32 font-bold hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* REQUEST LIST */}
      <div className="mt-6 grid gap-6">
        {filteredRequests.length === 0 && (
          <p className="text-center text-gray-500">No requests found 😢</p>
        )}

        {filteredRequests.map(r => (
          <div key={r._id} className="bg-white border border-red-200 rounded-lg p-5 shadow hover:shadow-md transition">

            <p className="text-2xl font-semibold text-red-600">
              {r.bloodGroupNeeded} — {r.quantity} Units
            </p>
            <p><strong>Name:</strong> {r.name}</p>
            <p><strong>City:</strong> {r.city}</p>
            <p><strong>Phone:</strong> {r.phone}</p>
            <p><strong>Status:</strong> {r.status}</p>

            {/* 🔹 BUTTON LOGIC: Mine → Find Donors | Others → Donate */}
            {user && user.id === r.userId ? (
              <button
                onClick={() => findDonors(r._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
              >
                🔍 Find Donors
              </button>
            ) : (
              <button
                onClick={() => handleDonate(r._id)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
              >
                ❤️ Donate
              </button>
            )}
          </div>
        ))}
      </div>

      {/* DONOR MATCH MODAL */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          Matching Donors
        </h2>

        {matches.length === 0 && <p className="text-gray-500">No matching donors found 😢</p>}

        {matches.map(d => (
          <div key={d._id} className="border p-3 rounded mt-2 bg-gray-50">
            <p><strong>Name:</strong> {d.name}</p>
            <p><strong>Blood Group:</strong> {d.bloodGroup}</p>
            <p><strong>City:</strong> {d.city}</p>
            <p><strong>Phone:</strong> {d.phone}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
}
