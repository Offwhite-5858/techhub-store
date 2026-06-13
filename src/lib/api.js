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

// HERO SETTINGS
export async function fetchHero() {
  const { data, error } = await supabase.from("hero_settings").select("*").single();
  if (error && error.code !== "PGRST116") console.error(error);
  return data || { headline: "Premium tech, unbeatable prices", subheadline: "Cutting-edge devices with warranty and free delivery.", hero_image_url: "" };
}

export async function saveHero(hero) {
  const { error } = await supabase.from("hero_settings").upsert({ id: 1, ...hero });
  if (error) console.error(error);
}
// REVIEWS
export async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
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