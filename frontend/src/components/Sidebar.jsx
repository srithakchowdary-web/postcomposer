import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-pink-50 border-r border-pink-100 min-h-screen p-6 flex flex-col">
      <h1 className="text-xl font-semibold text-pink-500 mb-8">PostComposer</h1>
      <p className="text-sm text-gray-500 mb-6">
        Signed in as <span className="font-medium">{user?.username}</span>
      </p>
      <nav className="flex-1">
        <p className="uppercase text-xs text-gray-400 mb-2">Settings</p>
        <ul className="space-y-2">
          <li>
            <Link
              to="/change-password"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-100"
            >
              Change Password
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-100"
            >
              Logout
            </button>
          </li>
        </ul>

        {user?.role === "Admin" && (
          <div className="mt-8">
            <p className="uppercase text-xs text-gray-400 mb-2">Admin Panel</p>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-100"
            >
              Users &amp; Posts
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}