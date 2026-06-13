"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function ReviewForm({ productId, onReviewAdded }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, customer_name: name.trim(), rating, text: text.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName("");
        setRating(5);
        setText("");
        if (onReviewAdded) onReviewAdded();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 text-green-700 rounded-2xl p-6 text-center border border-green-200">
        <p className="font-semibold">✅ Review Submitted!</p>
        <p className="text-sm mt-1">Thank you for your feedback.</p>
        <button onClick={() => setSubmitted(false)} className="mt-3 text-sm font-medium underline hover:text-green-800">
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="font-semibold text-dark-900">Write a Review</h3>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Your name"
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 transition-colors"
      />

      <div className="flex items-center gap-1">
        <span className="text-sm text-dark-500 mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={star <= rating ? "text-accent-400 fill-accent-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows={3}
        placeholder="Share your experience with this product..."
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 transition-colors resize-none"
      />

      <button
        type="submit"
        disabled={loading || !name.trim() || !text.trim()}
        className="flex items-center gap-2 px-6 py-2.5 bg-dark-900 text-white rounded-xl text-sm font-medium hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}