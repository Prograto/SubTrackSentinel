import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setMsg("If email exists, reset link sent");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={submit} className="bg-white p-8 shadow rounded w-96">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-indigo-600 text-white w-full py-2 rounded">
          Send Reset Link
        </button>
        {msg && <p className="text-green-600 mt-3">{msg}</p>}
      </form>
    </div>
  );
}
