import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Donor() {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    phone: "",
    quantity: "",
    email: "",
  });

  const [myDonations, setMyDonations] = useState([]);

  // auth
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Auto-fill email if user is logged in
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
      fetchMyDonations();
    }
  }, [user, navigate]);

  // fetch only user's donations
  const fetchMyDonations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setMyDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Donation fetch error:", err);
    }
  };

  // submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/donors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Thank you! Your donation will help save lives ❤️");
        fetchMyDonations(); // refresh list
        setFormData({
          name: "",
          bloodGroup: "",
          city: "",
          phone: formData.phone,
          quantity: "",
          email: formData.email, // keep email
        });
      } else {
        alert("Error: " + (data.error || data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to submit donation. Please check your connection.");
    }
  };

  // delete donation
  const deleteDonation = async (id) => {
    if (!window.confirm("Delete this donation?")) return;

    await fetch(`${API_URL}/api/donors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setMyDonations(myDonations.filter((d) => d._id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-red-600">
        Become a Donor ❤️
      </h1>

      {/* Donor Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white shadow p-6 rounded-lg space-y-3"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="border p-3 rounded w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          className="border p-3 rounded w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <select
          className="border p-3 rounded w-full"
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <input
          type="text"
          placeholder="City"
          className="border p-3 rounded w-full"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="border p-3 rounded w-full"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Quantity (Units)"
          className="border p-3 rounded w-full"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
        />

        <button className="bg-red-600 text-white font-bold px-6 py-3 rounded w-full hover:bg-red-700">
          Submit Donation
        </button>
      </form>

      {/* USER DONATION HISTORY */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">
          Your Donations
        </h2>

        {myDonations.length === 0 && (
          <p className="text-gray-500">You haven't donated yet.</p>
        )}

        {myDonations.map((d) => (
          <div
            key={d._id}
            className="bg-white shadow p-4 rounded-lg mt-3 border-l-4 border-green-600"
          >
            <p>
              <strong>Blood Group:</strong> {d.bloodGroup} — {d.quantity} Units
            </p>
            <p>
              <strong>City:</strong> {d.city}
            </p>
            <p>
              <strong>Phone:</strong> {d.phone}
            </p>
            <p>
              <strong>Donated On:</strong>{" "}
              {new Date(d.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => deleteDonation(d._id)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
