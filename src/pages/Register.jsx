import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input change safely
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Form submit
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔒 Frontend validation
    if (!form.username || !form.email || !form.password || !form.phone) {
      return setError("All fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password.length > 50) {
      return setError("Password is too long");
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold mb-2">
          Create Account
        </h2>
        <p className="text-slate-500 mb-4">
          Start tracking your subscriptions
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-sm text-center text-slate-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
