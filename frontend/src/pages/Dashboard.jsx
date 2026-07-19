import { useEffect, useMemo, useState } from "react";
import api, { API_URL } from "../utils/api";
import Sidebar from "../components/Sidebar.jsx";
import PlatformSelector, { LIMITS } from "../components/PlatformSelector.jsx";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export default function Dashboard() {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [images, setImages] = useState([]); // File[]
  const [scheduledDate, setScheduledDate] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [posts, setPosts] = useState([]);
  const previews = useMemo(
    () => images.map((f) => ({ name: f.name, url: URL.createObjectURL(f), size: f.size })),
    [images]
  );
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);
  const loadPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []);
  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };
  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  const validateClient = ({ schedule }) => {
    const errs = [];
    if (!content.trim()) errs.push("Post content cannot be empty");
    if (platforms.length === 0) errs.push("Select at least one platform");
    for (const p of platforms) {
      if (content.length > LIMITS[p]) {
        errs.push(
          `${p}: Character limit exceeded (${LIMITS[p]} allowed, ${content.length} entered)`
        );
      }
    }
    for (const f of images) {
      if (f.size > MAX_IMAGE_BYTES) {
        errs.push(`Image "${f.name}" exceeds the maximum size of 10 MB.`);
      }
    }
    if (schedule) {
      if (!scheduledDate) errs.push("Choose a date and time to schedule");
      else if (new Date(scheduledDate).getTime() <= Date.now())
        errs.push("Scheduled date and time must be in the future");
    }
    return errs;
  };
  const buildFormData = () => {
    const fd = new FormData();
    fd.append("content", content);
    fd.append("platforms", JSON.stringify(platforms));
    images.forEach((f) => fd.append("images", f));
    return fd;
  };
  const submit = async (schedule) => {
    setErrors([]);
    setSuccess("");
    const errs = validateClient({ schedule });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      const fd = buildFormData();
      if (schedule) fd.append("scheduledDate", new Date(scheduledDate).toISOString());
      const url = schedule ? "/posts/schedule" : "/posts";
      const { data } = await api.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(data.message || (schedule ? "Post scheduled" : "Post published"));
      setContent("");
      setPlatforms([]);
      setImages([]);
      setScheduledDate("");
      loadPosts();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setErrors([data?.message || "Something went wrong"]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Compose a Post</h2>
        <div className="bg-white border border-pink-100 rounded-2xl shadow-sm p-6 space-y-5 max-w-3xl">
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              rows={7}
              className="w-full mt-1 border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="What do you want to say?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              {content.length} characters
            </div>
          </div>
          <PlatformSelector selected={platforms} onChange={setPlatforms} />
          <div>
            <label className="text-sm font-medium">Images (max 10 MB each)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="block mt-2 text-sm"
            />
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((p, i) => (
                  <div
                    key={i}
                    className="relative border border-pink-100 rounded-lg overflow-hidden"
                  >
                    <img src={p.url} alt={p.name} className="w-full h-24 object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white/90 border border-pink-200 text-xs rounded px-1"
                    >
                      ✕
                    </button>
                    <div className="text-[10px] p-1 truncate">{p.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Schedule (optional)</label>
            <input
              type="datetime-local"
              className="block mt-1 border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          {errors.length > 0 && (
            <ul className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm space-y-1">
              {errors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
              {success}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => submit(false)}
              disabled={busy}
              className="bg-pink-400 hover:bg-pink-500 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
            >
              {busy ? "Working..." : "Post"}
            </button>
            <button
              onClick={() => submit(true)}
              disabled={busy}
              className="bg-white border border-pink-300 text-pink-500 hover:bg-pink-50 font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
            >
              Schedule
            </button>
          </div>
        </div>
        <section className="mt-10 max-w-3xl">
          <h3 className="text-lg font-semibold mb-3">Your Posts</h3>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-sm">No posts yet.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                <li
                  key={p._id}
                  className="border border-pink-100 rounded-xl p-4 bg-white"
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {p.platforms.join(", ")} · {p.status}
                      {p.scheduledDate &&
                        ` · ${new Date(p.scheduledDate).toLocaleString()}`}
                    </span>
                    <span>{new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{p.content}</p>
                  {p.images?.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {p.images.map((src, i) => (
                        <img
                          key={i}
                          src={`${API_URL}${src}`}
                          alt=""
                          className="w-20 h-20 object-cover rounded border border-pink-100"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
