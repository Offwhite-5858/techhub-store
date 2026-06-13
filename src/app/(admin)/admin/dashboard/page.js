"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingBag, TrendingUp, Users, LogOut, Plus, Trash2, Save, Check, Eye, Upload, Settings, Star } from "lucide-react";
import Link from "next/link";
import { fetchProducts, saveProducts, deleteProduct, fetchOrders, updateOrderStatus, fetchHero, saveHero } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviewsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [editHero, setEditHero] = useState({ headline: "", subheadline: "", hero_image_url: "" });

  useEffect(() => {
    if (!sessionStorage.getItem("techhub-admin")) { router.push("/admin"); return; }
    loadData();
  }, []);

  const loadData = async () => {
    const [prods, ords, heroData] = await Promise.all([fetchProducts(), fetchOrders(), fetchHero()]);
    setProducts(prods);
    setOrders(ords);
    setEditHero(heroData);
    loadAllReviews();
    setLoading(false);
  };

  const loadAllReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    if (Array.isArray(data)) setReviewsState(data);
  };

  const handleSaveProducts = async () => { await saveProducts(products); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleSaveHero = async () => { await saveHero(editHero); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const addProduct = () => setProducts([...products, { name: "New Product", category: "phones", brand: "", our_price: 0, market_price: 0, description: "", specs: {}, image_url: "", featured: false, stock: true }]);
  const removeProduct = async (i) => { if (products[i].id) await deleteProduct(products[i].id); setProducts(products.filter((_, j) => j !== i)); };
  const updateStatus = async (id, status) => { await updateOrderStatus(id, status); loadData(); };
  const handleLogout = () => { sessionStorage.removeItem("techhub-admin"); router.push("/admin"); };
  const handleDeleteReview = async (id) => { await fetch(`/api/reviews?id=${id}`, { method: "DELETE" }); loadAllReviews(); };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(index);
    const fileName = `products/${Date.now()}-${file.name}`;
    try {
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      const updated = [...products]; updated[index].image_url = data.publicUrl; setProducts(updated);
    } catch (err) { alert("Upload failed"); }
    setUploading(null);
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fileName = `hero/${Date.now()}-${file.name}`;
    try {
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setEditHero({ ...editHero, hero_image_url: data.publicUrl });
    } catch (err) { alert("Upload failed"); }
  };

  const tabs = [
    { id: "products", name: "Products", icon: Package },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    { id: "reviews", name: "Reviews", icon: Star },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package size={40} className="text-brand-400 mx-auto mb-4 animate-pulse" />
          <p className="text-dark-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-brand-600" />
            <h1 className="text-lg font-bold text-dark-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/" target="_blank" className="text-xs text-dark-500 hover:text-brand-600 flex items-center gap-1">
              <Eye size={14} /> <span className="hidden sm:inline">View Store</span>
            </Link>
            <button onClick={handleLogout} className="p-2 text-dark-400 hover:text-red-500">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 md:w-56 bg-white border-r min-h-[calc(100vh-56px)] p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left text-sm transition-all ${
                  activeTab === tab.id ? "bg-brand-50 text-brand-700 font-medium" : "text-dark-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { label: "Products", value: products.length, icon: Package, color: "bg-blue-50 text-blue-600" },
              { label: "Orders", value: orders.length, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
              { label: "Revenue", value: "₦" + totalRevenue.toLocaleString(), icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
              { label: "Pending", value: pendingOrders, icon: Users, color: "bg-orange-50 text-orange-600" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className={`w-8 h-8 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                  <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark-900">Products</h2>
                <div className="flex gap-2">
                  <button onClick={addProduct} className="flex items-center gap-1 px-3 py-2 bg-dark-900 text-white rounded-xl text-xs font-medium hover:bg-dark-800">
                    <Plus size={14} /> Add
                  </button>
                  <button onClick={handleSaveProducts} className="flex items-center gap-1 px-3 py-2 bg-brand-600 text-white rounded-xl text-xs font-medium hover:bg-brand-700">
                    {saved ? <Check size={14} /> : <Save size={14} />} {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {products.map((product, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex gap-4 mb-3">
                      {/* Image Upload */}
                      <div className="relative w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border-2 border-dashed border-gray-200">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-dark-300 text-xs">No img</div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Upload size={16} className="text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </label>
                      </div>
                      {/* Fields */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                        <input type="text" value={product.name} onChange={(e) => { const u = [...products]; u[index].name = e.target.value; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Product name" />
                        <input type="text" value={product.brand || ""} onChange={(e) => { const u = [...products]; u[index].brand = e.target.value; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Brand" />
                        <input type="number" value={product.our_price || 0} onChange={(e) => { const u = [...products]; u[index].our_price = parseInt(e.target.value) || 0; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Price" />
                        <input type="number" value={product.market_price || 0} onChange={(e) => { const u = [...products]; u[index].market_price = parseInt(e.target.value) || 0; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Market Price" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      <select value={product.category || "phones"} onChange={(e) => { const u = [...products]; u[index].category = e.target.value; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none">
                        <option value="phones">Phones</option><option value="laptops">Laptops</option><option value="accessories">Audio</option><option value="smart-devices">Wearables</option>
                      </select>
                      <input type="text" value={product.description || ""} onChange={(e) => { const u = [...products]; u[index].description = e.target.value; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Description" />
                      <input type="text" value={product.badge || ""} onChange={(e) => { const u = [...products]; u[index].badge = e.target.value; setProducts(u); }} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-brand-500" placeholder="Badge" />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={product.featured || false} onChange={(e) => { const u = [...products]; u[index].featured = e.target.checked; setProducts(u); }} /> Featured
                        </label>
                        <button onClick={() => removeProduct(index)} className="p-1 text-dark-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-lg font-bold text-dark-900 mb-4">Orders</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                      <div>
                        <p className="font-semibold text-dark-900">{order.customer_name}</p>
                        <p className="text-sm text-dark-500">{order.phone}</p>
                        <p className="text-xs text-dark-400">{order.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending" ? "bg-orange-100 text-orange-700" :
                          order.status === "processing" ? "bg-blue-100 text-blue-700" :
                          order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                          "bg-green-100 text-green-700"
                        }`}>{order.status}</span>
                        <span className="font-bold text-dark-900">₦{(order.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs outline-none">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-dark-400 text-center py-10">No orders yet</p>}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark-900">Customer Reviews</h2>
                <span className="text-sm text-dark-400">{reviews.length} total</span>
              </div>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold text-xs">
                          {review.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-dark-900 text-sm">{review.customer_name}</span>
                        <span className="text-xs text-dark-400">• Product #{review.product_id}</span>
                        <span className="text-xs text-dark-300">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex my-1 ml-9">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={star <= review.rating ? "text-accent-400 fill-accent-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-dark-500 ml-9">{review.text}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1.5 text-dark-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <span className="text-4xl block mb-3">⭐</span>
                    <p className="text-dark-400">No reviews yet</p>
                    <p className="text-xs text-dark-300 mt-1">Reviews will appear when customers submit them on product pages</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-lg font-bold text-dark-900 mb-4">Site Settings</h2>
              <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Hero Background Image</label>
                  <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden relative mb-2 border-2 border-dashed border-gray-200">
                    {editHero.hero_image_url ? (
                      <img src={editHero.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-300">Click to upload hero background</div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload size={24} className="text-white" />
                      <span className="text-white ml-2 font-medium">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                    </label>
                  </div>
                  {editHero.hero_image_url && (
                    <p className="text-xs text-dark-400 truncate">{editHero.hero_image_url}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={editHero.headline || ""}
                    onChange={(e) => setEditHero({ ...editHero, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Hero Subheadline</label>
                  <textarea
                    value={editHero.subheadline || ""}
                    onChange={(e) => setEditHero({ ...editHero, subheadline: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveHero}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700"
                >
                  {saved ? <Check size={16} /> : <Save size={16} />} Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}