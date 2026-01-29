import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        SubTrack Sentinel
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/subscriptions")}
          className="text-slate-600 hover:text-indigo-600"
        >
          Subscriptions
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
