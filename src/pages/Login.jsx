import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl mb-4">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-indigo-600 text-white w-full py-2 rounded">
          Login
        </button>

        <Link to="/forgot-password" className="text-sm text-indigo-500 block mt-3">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
