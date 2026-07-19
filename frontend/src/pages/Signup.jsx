import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext.jsx";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/signup", { username, password });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 border border-pink-100">
        <h1 className="text-2xl font-semibold text-pink-500 mb-6 text-center">
          PostComposer
        </h1>
        <h2 className="text-lg font-medium mb-4">Sign Up</h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link className="text-pink-500 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
