import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogAPI, uploadAPI } from "../../api/services";
import { BLOG_CATEGORIES } from "../../constants";
import toast from "react-hot-toast";

const EDITOR_URL = "https://vyomedge-text-editor.vercel.app/embed";

export default function AddBlog({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft",
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    scheduledAt: "",
  });
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editMode);
  const pendingEditorDataRef = useRef(null);
  const [initialData, setInitialData] = useState(null);

  const postEditorData = useCallback((html) => {
    if (!html || !editorRef.current?.contentWindow) return;
    editorRef.current.contentWindow.postMessage(
      {
        type: "custom-text-editor:set-data",
        payload: {
          title: "Edited From Parent Website",
          html,
        },
      },
      "*",
    );
  }, []);

  useEffect(() => {
    if (!editMode || !id) return;
    blogAPI
      .adminGetAll()
      .then((r) => {
        const blogs = r.data?.blogs || r.data || [];
        const blog = blogs.find((b) => b._id === id);
        if (!blog) {
          toast.error("Blog not found");
          navigate("/admin/blogs");
          return;
        }
        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          category: blog.category || "",
          tags: (blog.tags || []).join(", "),
          status: blog.status || "draft",
          featuredImage: blog.featuredImage || "",
          seoTitle: blog.seoTitle || "",
          seoDescription: blog.seoDescription || "",
          seoKeywords: blog.seoKeywords || "",
          canonicalUrl: blog.canonicalUrl || "",
          scheduledAt: blog.scheduledAt ? blog.scheduledAt.slice(0, 16) : "",
        });
        setContent(blog.content || "");
        setInitialData(blog);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [editMode, id]);

  useEffect(() => {
    if (!initialData) return;
    pendingEditorDataRef.current = initialData;
    if (editorReady) {
      postEditorData(initialData.content);
    }
    pendingEditorDataRef.current = null;
  }, [initialData, editorReady, postEditorData]);

  const handleTitleChange = (val) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug:
        !editMode || !f.slug
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()
          : f.slug,
      seoTitle: !f.seoTitle ? val : f.seoTitle,
    }));
  };

  const handleExcerptChange = (val) => {
    setForm((f) => ({
      ...f,
      excerpt: val,
      seoDescription: !f.seoDescription ? val : f.seoDescription,
    }));
  };

  const handleSlugChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    setForm((f) => ({ ...f, slug: clean, canonicalUrl: `/blog/${clean}` }));
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      const { type, payload } = e.data;

      if (type === "custom-text-editor:data" && payload?.html !== undefined)
        setContent(payload.html);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [editMode, content]);

  useEffect(() => {
    if (editorReady && editMode && content) {
      editorRef.current?.contentWindow?.postMessage(
        { type: "SET_CONTENT", payload: content },
        "*",
      );
    }
  }, [editorReady]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await uploadAPI.uploadImage(fd);
      setForm((f) => ({ ...f, featuredImage: data.url || data.secure_url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = useCallback(
    async (statusOverride) => {
      const finalStatus = statusOverride || form.status;
      if (!form.title.trim()) {
        toast.error("Title is required");
        return;
      }
      setSaving(true);
      try {
        const payload = {
          ...form,
          content,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status: finalStatus,
          canonicalUrl: form.canonicalUrl || `/blog/${form.slug}`,
          scheduledAt: form.scheduledAt || undefined,
        };
        if (editMode && id) {
          await blogAPI.update(id, payload);
          toast.success("Blog updated!");
        } else {
          await blogAPI.create(payload);
          toast.success("Blog created!");
        }
        navigate("/admin/blogs");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save blog");
      } finally {
        setSaving(false);
      }
    },
    [form, content, editMode, id],
  );

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen = form.seoDescription.length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-t-green-500 border-green-100 animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1
            className="text-xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {editMode ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            All fields below are fully SEO-optimised
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin/blogs")}
            className="btn-secondary btn-sm text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="btn-secondary btn-sm text-xs"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-primary btn-sm text-xs"
          >
            {saving ? "Publishing…" : "Publish Now"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Blog Post Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Choose the Right Serum for Your Skin Type"
              className="input-field text-lg font-semibold"
              required
            />
            {form.slug && (
              <p className="text-xs text-gray-400 mt-1.5">
                URL:{" "}
                <span className="text-green-600 font-mono">
                  /blog/{form.slug}
                </span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Content *
              </label>
              {!editorReady && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border-2 border-t-green-400 border-gray-200 animate-spin inline-block" />
                  Loading editor…
                </span>
              )}
            </div>
            <iframe
              ref={editorRef}
              src={EDITOR_URL}
              title="Blog Content Editor"
              onLoad={() => setEditorReady(true)}
              className="w-full border-0"
              style={{ height: "520px" }}
              allow="clipboard-read; clipboard-write"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Excerpt (Short Summary)
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => handleExcerptChange(e.target.value)}
              placeholder="A short description that appears in blog listings and search results (150–160 chars ideal)"
              rows={3}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.excerpt.length} chars
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-charcoal mb-4">
              Publish Settings
            </h3>
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="input-field text-sm py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            {form.status === "scheduled" && (
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                  }
                  className="input-field text-sm py-2"
                />
              </div>
            )}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="input-field text-sm py-2"
              >
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="vitamin c, serum, skincare"
                className="input-field text-sm py-2"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-charcoal mb-4">
              Featured Image
            </h3>
            {form.featuredImage ? (
              <div className="relative rounded-lg overflow-hidden mb-3 aspect-video">
                <img
                  src={form.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setForm((f) => ({ ...f, featuredImage: "" }))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all">
                <span className="text-2xl mb-2">🖼️</span>
                <span className="text-xs text-gray-500 text-center">
                  Click to upload featured image
                  <br />
                  (JPG, PNG, WebP · Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {uploading && (
              <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
                <span className="animate-spin">⟳</span> Uploading…
              </p>
            )}
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Or paste image URL
              </label>
              <input
                type="url"
                value={form.featuredImage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featuredImage: e.target.value }))
                }
                placeholder="https://..."
                className="input-field text-xs py-2"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-green-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🔍</span>
              <h3 className="text-sm font-bold text-charcoal">
                SEO Meta Fields
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  SEO Title{" "}
                  <span
                    className={`ml-1 font-semibold ${seoTitleLen > 60 ? "text-red-500" : seoTitleLen > 50 ? "text-yellow-500" : "text-green-500"}`}
                  >
                    {seoTitleLen}/60
                  </span>
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seoTitle: e.target.value }))
                  }
                  placeholder="SEO title (50–60 chars ideal)"
                  className="input-field text-sm py-2"
                  maxLength={70}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Leave blank to use post title.
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Meta Description{" "}
                  <span
                    className={`ml-1 font-semibold ${seoDescLen > 160 ? "text-red-500" : seoDescLen > 140 ? "text-yellow-500" : "text-green-500"}`}
                  >
                    {seoDescLen}/160
                  </span>
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seoDescription: e.target.value }))
                  }
                  placeholder="Compelling description for search engines (140–160 chars)"
                  rows={3}
                  className="input-field text-sm resize-none"
                  maxLength={170}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Focus Keywords
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seoKeywords: e.target.value }))
                  }
                  placeholder="best serum for acne india, vitamin c serum"
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={form.canonicalUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, canonicalUrl: e.target.value }))
                  }
                  placeholder="/blog/your-post-slug"
                  className="input-field text-sm py-2 font-mono"
                />
              </div>
              {(form.seoTitle || form.title) && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Google Preview
                  </p>
                  <p className="text-sm font-medium text-blue-700 truncate">
                    {form.seoTitle || form.title}
                  </p>
                  <p className="text-[10px] text-green-700 font-mono">
                    maasha-client.onrender.com
                    {form.canonicalUrl || `/blog/${form.slug}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {form.seoDescription ||
                      form.excerpt ||
                      "No description set"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="post-url-slug"
              className="input-field text-sm py-2 font-mono"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Auto-generated from title. Only use lowercase, numbers, hyphens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditBlog() {
  return <AddBlog editMode={true} />;
}
