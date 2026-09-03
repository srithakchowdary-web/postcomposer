import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import api from "../utils/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const { data } = await api.get("/admin");
        setUsers(data.users || []);
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-pink-500 font-medium">Admin Panel</p>
              <h2 className="text-2xl font-semibold">Users and Posts</h2>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-pink-500 hover:text-pink-600"
            >
              Back to composer
            </Link>
          </div>

          {loading && <p className="text-sm text-gray-500">Loading admin data...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold mb-3">Users</h3>
                <div className="border border-pink-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-pink-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Username</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="px-4 py-4 text-gray-500">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-3">{user.username}</td>
                            <td className="px-4 py-3">{user.role}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Posts</h3>
                <div className="border border-pink-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-pink-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Platform</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-4 text-gray-500">
                            No posts found.
                          </td>
                        </tr>
                      ) : (
                        posts.flatMap((post) =>
                          post.platforms.map((platform) => (
                            <tr key={`${post.id}-${platform}`}>
                              <td className="px-4 py-3">{post.username}</td>
                              <td className="px-4 py-3">{platform}</td>
                              <td className="px-4 py-3">{post.status}</td>
                            </tr>
                          ))
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}