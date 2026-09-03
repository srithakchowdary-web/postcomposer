import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Sidebar from "../components/Sidebar.jsx";
export default function ChangePassword() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setBusy(true);
    try {
      const { data } = await api.put("/change-password", {
        currentPassword,
        newPassword,
      });
      setMsg(data.message || "Password updated");
      setCurrent("");
      setNew("");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to change password");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-md bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={submit} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              minLength={6}
              required
            />
            {err && <p className="text-red-500 text-sm">{err}</p>}
            {msg && <p className="text-green-600 text-sm">{msg}</p>}
            <div className="flex gap-3">
              <button
                disabled={busy}
                className="bg-pink-400 hover:bg-pink-500 text-white font-medium px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {busy ? "Saving..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="border border-pink-200 text-pink-500 px-5 py-2 rounded-lg hover:bg-pink-50"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
