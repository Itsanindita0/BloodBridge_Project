import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Receiver() {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  // include email in state
  const [formData, setFormData] = useState({
    name: "",
    bloodGroupNeeded: "",
    city: "",
    phone: "",
    quantity: "",
    email: "",
  });

  const [myRequests, setMyRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);

  /* -----------------------------------------------------
     REDIRECT IF USER NOT LOGGED IN
  ----------------------------------------------------- */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return <p className="text-center mt-10">Redirecting...</p>;

  /* -----------------------------------------------------
     FETCH LOGGED USER REQUESTS
  ----------------------------------------------------- */
  const fetchMyRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/receivers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setMyRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  /* -----------------------------------------------------
     SUBMIT OR UPDATE REQUEST
  ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/receivers/${editingId}`
      : `http://localhost:5000/api/receivers`;

    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Error: " + data.error);
      return;
    }

    alert(editingId ? "Request updated!" : "Request submitted!");

    // RESET FORM — keep email for next donation
    setFormData({
      name: "",
      bloodGroupNeeded: "",
      city: "",
      phone: "",
      quantity: "",
      email: formData.email,
    });

    setEditingId(null);
    fetchMyRequests();
  };

  /* -----------------------------------------------------
     DELETE REQUEST
  ----------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;

    await fetch(`http://localhost:5000/api/receivers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMyRequests();
  };

  /* -----------------------------------------------------
     MARK FULFILLED
  ----------------------------------------------------- */
  const handleFulfill = async (id) => {
    const res = await fetch(`http://localhost:5000/api/receivers/${id}/fulfill`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data.success) return alert("Error: " + data.message);

    alert("Marked as fulfilled!");
    fetchMyRequests();
  };

  /* -----------------------------------------------------
     EDIT REQUEST — load into form
  ----------------------------------------------------- */
  const handleEdit = (req) => {
    setFormData({
      name: req.name,
      bloodGroupNeeded: req.bloodGroupNeeded,
      city: req.city,
      phone: req.phone,
      quantity: req.quantity,
      email: req.email, // <-- important fix!
    });

    setEditingId(req._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -----------------------------------------------------
     INITIAL LOAD
  ----------------------------------------------------- */
  useEffect(() => {
    fetchMyRequests();
  }, []);

  /* -----------------------------------------------------
     UI
  ----------------------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-red-600">
        Request Blood 🩸
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white shadow-lg p-6 rounded-lg space-y-3"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="border p-3 rounded w-full"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="border p-3 rounded w-full"
          value={formData.email}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <select
          className="border p-3 rounded w-full"
          value={formData.bloodGroupNeeded}
          required
          onChange={(e) =>
            setFormData({ ...formData, bloodGroupNeeded: e.target.value })
          }
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option><option value="A-">A-</option>
          <option value="B+">B+</option><option value="B-">B-</option>
          <option value="O+">O+</option><option value="O-">O-</option>
          <option value="AB+">AB+</option><option value="AB-">AB-</option>
        </select>

        <input
          type="text"
          placeholder="City"
          className="border p-3 rounded w-full"
          value={formData.city}
          required
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="border p-3 rounded w-full"
          value={formData.phone}
          required
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity (Units)"
          className="border p-3 rounded w-full"
          value={formData.quantity}
          required
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
        />

        <button className="bg-red-600 text-white font-bold px-6 py-3 rounded w-full hover:bg-red-700">
          {editingId ? "Update Request" : "Submit Request"}
        </button>
      </form>

      {/* USER REQUESTS */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">
          Your Requests
        </h2>

        {myRequests.length === 0 && (
          <p className="text-gray-500">No requests found</p>
        )}

        {myRequests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow p-4 rounded-lg mt-3 border-l-4 border-red-600"
          >
            <p>
              <strong>{req.bloodGroupNeeded}</strong> — {req.quantity} Units
            </p>
            <p><strong>City:</strong> {req.city}</p>
            <p><strong>Status:</strong> {req.status}</p>
            <p><strong>Email:</strong> {req.email}</p>
            <p><strong>Requested On:</strong> {new Date(req.createdAt).toLocaleString()}</p>

            <div className="mt-3 flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleEdit(req)}
              >
                ✏️ Edit
              </button>

              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleFulfill(req._id)}
              >
                ✅ Fulfill
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(req._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
