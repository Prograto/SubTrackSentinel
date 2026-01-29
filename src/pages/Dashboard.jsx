import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FILTER STATE */
  const [range, setRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [cycle, setCycle] = useState("all");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await api.get("/dashboard");
      const subsRes = await api.get("/subscriptions");

      setStats(statsRes.data);
      setSubs(subsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */

  const filteredSubs = useMemo(() => {
    const now = new Date();

    return subs.filter((s) => {
      const renewal = new Date(s.next_renewal_date);
      const daysDiff =
        (renewal - now) / (1000 * 60 * 60 * 24);

      if (range === "30" && daysDiff > 30) return false;
      if (range === "90" && daysDiff > 90) return false;
      if (range === "180" && daysDiff > 180) return false;
      if (range === "365" && daysDiff > 365) return false;

      if (category !== "all" && s.category !== category)
        return false;

      if (cycle !== "all" && s.billing_cycle !== cycle)
        return false;

      return true;
    });
  }, [subs, range, category, cycle]);

  /* ================= CHART DATA ================= */

  const spendByService = filteredSubs.map((s) => ({
    name: s.name,
    amount: s.amount,
  }));

  const spendByCategory = Object.values(
    filteredSubs.reduce((acc, s) => {
      const key = s.category || "Other";
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += s.amount;
      return acc;
    }, {})
  );

  const renewalTimeline = filteredSubs.map((s) => ({
    name: s.name,
    daysLeft: Math.ceil(
      (new Date(s.next_renewal_date) - new Date()) /
        (1000 * 60 * 60 * 24)
    ),
  }));

  const categories = [
    "all",
    ...new Set(subs.map((s) => s.category).filter(Boolean)),
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-500 mb-6">
          Subscription analytics & insights
        </p>

        {loading ? (
          <p className="text-slate-400">Loading dashboard...</p>
        ) : (
          <>
            {/* ===== STATS ===== */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Active Subscriptions" value={stats.total_subscriptions} />
              <StatCard title="Monthly Spend" value={`₹${stats.monthly_spend}`} />
              <StatCard title="Upcoming Renewals" value={stats.upcoming_renewals} />
              <StatCard title="Alerts Enabled" value={stats.alerts_enabled} />
            </div>

            {/* ===== FILTER BAR ===== */}
            <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-wrap gap-4">
              <select value={range} onChange={(e) => setRange(e.target.value)} className="border p-2 rounded">
                <option value="all">All Time</option>
                <option value="30">Next 30 days</option>
                <option value="90">Next 3 months</option>
                <option value="180">Next 6 months</option>
                <option value="365">Next 1 year</option>
              </select>

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>

              <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="border p-2 rounded">
                <option value="all">All Billing Cycles</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* ===== CHARTS ===== */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              <ChartCard title="Spend by Service">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={spendByService}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Spend by Category">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={spendByCategory} dataKey="value" nameKey="name" outerRadius={100} label>
                      {spendByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* ===== RENEWAL TIMELINE ===== */}
            <ChartCard title="Renewal Timeline (Days Left)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={renewalTimeline}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="daysLeft" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
      {/* ===== SUBSCRIPTIONS LIST ===== */}
      <div className="bg-white rounded-xl shadow p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Subscriptions ({filteredSubs.length})
        </h2>

        {filteredSubs.length === 0 ? (
          <p className="text-slate-400">
            No subscriptions match the selected filters
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2">Service</th>
                  <th>Category</th>
                  <th>Billing</th>
                  <th>Amount</th>
                  <th>Next Renewal</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubs.map((s) => {
                  const daysLeft = Math.ceil(
                    (new Date(s.next_renewal_date) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="py-3 font-medium">{s.name}</td>
                      <td>{s.category || "—"}</td>
                      <td className="capitalize">{s.billing_cycle}</td>
                      <td className="font-semibold">₹{s.amount}</td>
                      <td>
                        {new Date(
                          s.next_renewal_date
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            daysLeft <= 3
                              ? "bg-red-100 text-red-600"
                              : daysLeft <= 7
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {daysLeft <= 0
                            ? "Due"
                            : `${daysLeft} days`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

/* ===== COMPONENTS ===== */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
