import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config"; 

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      alert("Login successful!");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Email"
          type="email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Password"
          type="password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-red-600 text-white w-full p-2 rounded font-bold hover:bg-red-700">
          Login
        </button>
      </form>
    </div>
  );
}
