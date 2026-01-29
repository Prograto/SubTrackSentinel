import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  const sendAlerts = async () => {
    setLoading(true);
    await api.post("/admin/send-alerts");
    alert("Alerts sent successfully");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Stat title="Users" value={stats.total_users} />
            <Stat title="Subscriptions" value={stats.total_subscriptions} />
            <Stat title="Active Subs" value={stats.active_subscriptions} />
          </div>
        )}

        <button
          onClick={sendAlerts}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Sending..." : "Send Alerts to All Users"}
        </button>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <p className="text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
