import { supabase } from "@/lib/supabase";

// PRODUCTS
export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) console.error(error);
  return data || [];
}

export async function saveProducts(products) {
  for (const p of products) {
    const { error } = await supabase.from("products").upsert(p);
    if (error) console.error(error);
  }
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) console.error(error);
}

// ORDERS
export async function fetchOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) console.error(error);
}

// HERO
export async function fetchHero() {
  const { data, error } = await supabase.from("hero_settings").select("*").single();
  if (error && error.code !== "PGRST116") console.error(error);
  return data || { headline: "Premium tech, unbeatable prices", subheadline: "Cutting-edge devices with warranty and free delivery.", hero_image_url: "" };
}

export async function saveHero(hero) {
  const { error } = await supabase.from("hero_settings").upsert({ id: 1, ...hero });
  if (error) console.error(error);
}

// SITE SETTINGS (Announcement Bar)
export async function fetchSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").single();
  if (error && error.code !== "PGRST116") console.error(error);
  return data || { announcement_active: false, announcement_text: "" };
}

export async function saveSiteSettings(settings) {
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...settings });
  if (error) console.error(error);
}

// REVIEWS
export async function fetchReviews(productId) {
  let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

export async function fetchAllReviews() {
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function addReview(review) {
  const { error } = await supabase.from("reviews").insert(review);
  if (error) console.error(error);
}

export async function deleteReview(id) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) console.error(error);
}