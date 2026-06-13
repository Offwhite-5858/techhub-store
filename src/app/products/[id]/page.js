"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Zap, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { formatPrice, orderProduct } from "@/lib/whatsapp";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import ReviewForm from "@/components/products/ReviewForm";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/schema";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setAllProducts(data || []);
    }
    load();
  }, []);

  useEffect(() => {
    const found = allProducts.find((p) => p.id === parseInt(params.id));
    setProduct(found);
    if (found) loadReviews(found.id);
    window.scrollTo(0, 0);
  }, [params.id, allProducts]);

  const loadReviews = async (productId) => {
    const res = await fetch(`/api/reviews?product_id=${productId}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setReviews(data);
      if (data.length > 0) {
        setAverageRating(data.reduce((sum, r) => sum + r.rating, 0) / data.length);
      }
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.our_price || product.ourPrice || 0,
        quantity,
        imageUrl: product.image_url || product.imageUrl || "",
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Product not found</h1>
          <Link href="/products" className="text-brand-600 font-medium hover:underline">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const ourPrice = product.our_price || product.ourPrice || 0;
  const marketPrice = product.market_price || product.marketPrice || 0;
  const savings = marketPrice - ourPrice;
  const savingsPercent = marketPrice > 0 ? Math.round((savings / marketPrice) * 100) : 0;
  const specs = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs || {};
  const category = product.category || "";
  const badge = product.badge || "";
  const imageUrl = product.image_url || product.imageUrl || "";
  const brand = product.brand || "";
  const stockCount = product.stock_count || 0;
  const inStock = product.in_stock !== false;

  const relatedProducts = allProducts.filter((p) => p.category === category && p.id !== product.id).slice(0, 4);
  const otherProducts = allProducts.filter((p) => p.category !== category && p.id !== product.id).slice(0, 4);

  return (
    <>
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />

      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: "Home", url: "https://techhub-store.vercel.app" },
              { name: "Products", url: "https://techhub-store.vercel.app/products" },
              { name: product.name, url: `https://techhub-store.vercel.app/products/${product.id}` },
            ])
          ),
        }}
      />

      <main className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-dark-500 hover:text-brand-600 transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
            {/* Product Image with Zoom */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
              <div
                className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-contain p-6 sm:p-10 md:p-12 transition-transform duration-700 ease-out ${
                      imageZoom ? "scale-150" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl sm:text-9xl md:text-[10rem] transition-transform duration-500 hover:scale-110">
                      {category === "phones" ? "📱" : category === "laptops" ? "💻" : category === "accessories" ? "🎧" : "⌚"}
                    </span>
                  </div>
                )}

                {/* Stock badge on image */}
                {!inStock && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full z-20">
                    Out of Stock
                  </div>
                )}
                {inStock && stockCount > 0 && stockCount <= 3 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full z-20 animate-pulse">
                    Only {stockCount} left!
                  </div>
                )}
              </div>
              {imageUrl && (
                <p className="text-center text-xs text-dark-400 py-2 bg-gray-50">
                  🖱️ Hover to zoom
                </p>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">
                {brand}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(averageRating)
                        ? "text-accent-400 fill-accent-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-dark-400 ml-1">
                  {reviews.length > 0
                    ? `${averageRating.toFixed(1)} (${reviews.length} reviews)`
                    : "No reviews yet"}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-3">
                {!inStock || stockCount === 0 ? (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                ) : stockCount <= 3 ? (
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                    Only {stockCount} left in stock!
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {stockCount} in stock
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-dark-900">
                  {formatPrice(ourPrice)}
                </span>
                {marketPrice > ourPrice && (
                  <>
                    <span className="text-lg sm:text-xl text-dark-400 line-through">
                      {formatPrice(marketPrice)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      Save {savingsPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-dark-500 text-sm sm:text-base mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mb-8">
                <h3 className="font-semibold text-dark-900 mb-4">Specifications</h3>
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-dark-400">{key}</span>
                      <span className="text-dark-700 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-dark-400 hover:text-dark-600 font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-dark-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-dark-400 hover:text-dark-600 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all text-sm sm:text-base ${
                    !inStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : added
                      ? "bg-green-500 text-white"
                      : "bg-dark-900 text-white hover:bg-dark-800 active:scale-95"
                  }`}
                >
                  {!inStock ? (
                    "Sold Out"
                  ) : added ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>
                {inStock && (
                  <button
                    onClick={() => orderProduct(product.name, ourPrice)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-all active:scale-95 text-sm sm:text-base"
                  >
                    <Zap size={18} /> Order Now
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-dark-500">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-green-600" /> Free Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-green-600" /> 1 Year Warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={14} className="text-green-600" /> 7-Day Returns
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mb-16 sm:mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-dark-900">Customer Reviews</h2>
                <p className="text-sm text-dark-500 mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  {reviews.length > 0 && ` • ${averageRating.toFixed(1)} average rating`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {review.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900 text-sm">{review.customer_name}</p>
                          <p className="text-xs text-dark-400">
                            {new Date(review.created_at).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={
                              star <= review.rating
                                ? "text-accent-400 fill-accent-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-dark-600 text-sm leading-relaxed">{review.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                    <span className="text-4xl block mb-3">⭐</span>
                    <p className="text-dark-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div>
                <ReviewForm
                  productId={product.id}
                  onReviewAdded={() => loadReviews(product.id)}
                />
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mb-12 sm:mb-16">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-brand-600 uppercase tracking-wider mb-1">
                    Similar Products
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-900">
                    More in{" "}
                    {category === "phones"
                      ? "Phones"
                      : category === "laptops"
                      ? "Laptops"
                      : category === "accessories"
                      ? "Audio"
                      : "Wearables"}
                  </h2>
                </div>
                <Link
                  href={`/products?category=${category}`}
                  className="hidden sm:flex items-center gap-1 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Link
                href={`/products?category=${category}`}
                className="sm:hidden flex items-center justify-center gap-1 mt-4 text-sm text-brand-600 font-medium"
              >
                View All →
              </Link>
            </section>
          )}

          {/* Explore More */}
          {otherProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-brand-600 uppercase tracking-wider mb-1">
                    You Might Also Like
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-900">Explore More</h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:flex items-center gap-1 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
                >
                  View All Products →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {otherProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Link
                href="/products"
                className="sm:hidden flex items-center justify-center gap-1 mt-4 text-sm text-brand-600 font-medium"
              >
                View All Products →
              </Link>
            </section>
          )}
        </div>
      </main>
    </>
  );
}