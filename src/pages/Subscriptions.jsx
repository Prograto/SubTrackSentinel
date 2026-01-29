import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const billingOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly (3 months)", value: "quarterly" },
  { label: "Half-Yearly (6 months)", value: "half_yearly" },
  { label: "Yearly", value: "yearly" },
];

const emptyForm = {
  name: "",
  category: "",
  amount: "",
  billing_cycle: "monthly",
  start_date: "",
  alerts_enabled: true,
  remind_before_days: 3,
};

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔹 FILTERS */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cycle, setCycle] = useState("all");
  const [sortBy, setSortBy] = useState("renewal");

  /* ================= LOAD ================= */

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await api.get("/subscriptions/");
      setSubs(res.data);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SORT ================= */

  const filteredSubs = useMemo(() => {
    let data = [...subs];

    // Search
    if (search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category !== "all") {
      data = data.filter((s) => s.category === category);
    }

    // Billing cycle
    if (cycle !== "all") {
      data = data.filter((s) => s.billing_cycle === cycle);
    }

    // Sorting
    if (sortBy === "amount") {
      data.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "renewal") {
      data.sort(
        (a, b) =>
          new Date(a.next_renewal_date) -
          new Date(b.next_renewal_date)
      );
    }

    return data;
  }, [subs, search, category, cycle, sortBy]);

  const categories = [
    "all",
    ...new Set(subs.map((s) => s.category).filter(Boolean)),
  ];

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      amount: Number(form.amount),
      billing_cycle: form.billing_cycle,
      alerts_enabled: form.alerts_enabled,
      remind_before_days: Number(form.remind_before_days),
    };

    if (form.category.trim()) payload.category = form.category.trim();
    if (form.start_date) payload.start_date = form.start_date;

    try {
      if (editingId) {
        await api.put(`/subscriptions/${editingId}`, payload);
      } else {
        await api.post("/subscriptions/", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchSubs();
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to save subscription");
    }
  };

  /* ================= EDIT ================= */

  const editSub = (s) => {
    setForm({
      name: s.name,
      category: s.category || "",
      amount: s.amount,
      billing_cycle: s.billing_cycle,
      start_date: s.start_date
        ? s.start_date.slice(0, 10)
        : "",
      alerts_enabled: s.alerts_enabled,
      remind_before_days: s.remind_before_days,
    });
    setEditingId(s.id);
  };

  /* ================= DELETE ================= */

  const deleteSub = async (id) => {
    if (!window.confirm("Remove this subscription?")) return;
    await api.delete(`/subscriptions/${id}`);
    fetchSubs();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>

        {/* ===== FORM ===== */}
        <form
          onSubmit={submit}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Update Subscription" : "Add Subscription"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Service Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-2 rounded"
              required
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="border p-2 rounded"
              required
            />

            <select
              value={form.billing_cycle}
              onChange={(e) =>
                setForm({ ...form, billing_cycle: e.target.value })
              }
              className="border p-2 rounded"
            >
              {billingOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm({ ...form, start_date: e.target.value })
              }
              className="border p-2 rounded"
              required={!editingId}
            />

            <select
              value={form.remind_before_days}
              onChange={(e) =>
                setForm({
                  ...form,
                  remind_before_days: Number(e.target.value),
                })
              }
              className="border p-2 rounded"
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>7 days before</option>
            </select>
          </div>

          <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded">
            {editingId ? "Update" : "Add"} Subscription
          </button>
        </form>

        {/* ===== FILTER BAR ===== */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4">
          <input
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Billing Cycles</option>
            {billingOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="renewal">Sort by Renewal</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* ===== LIST ===== */}
        <div className="bg-white rounded-xl shadow">
          {loading ? (
            <p className="p-6 text-slate-400">Loading...</p>
          ) : filteredSubs.length === 0 ? (
            <p className="p-6 text-slate-400">
              No subscriptions found
            </p>
          ) : (
            filteredSubs.map((s) => {
              const daysLeft = Math.ceil(
                (new Date(s.next_renewal_date) - new Date()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-4 border-b hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-slate-500">
                      ₹{s.amount} • {s.billing_cycle} •{" "}
                      {s.category || "Other"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
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

                    <button
                      onClick={() => editSub(s)}
                      className="text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSub(s.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
