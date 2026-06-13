import siteConfig from "@/data/siteConfig";

export function formatPrice(price) {
  return "₦" + price.toLocaleString("en-NG");
}

export function openWhatsApp(message) {
  const url = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export function orderProduct(productName, price) {
  const message = `Hi TechHub! I'd like to order:\n\n📱 ${productName}\n💰 Price: ${formatPrice(price)}\n\nCan you confirm availability?`;
  openWhatsApp(message);
}

export function orderCart(cartItems, total, customerName, phone, address) {
  let itemsList = cartItems.map((item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`).join("\n");
  const message = `🛒 *New Order*\n\n${itemsList}\n\n━━━━━━━━━━━\n💰 Total: ${formatPrice(total)}\n🚚 Shipping: FREE\n\n📞 Contact: ${phone}\n👤 Name: ${customerName}\n📍 Delivery: ${address}`;
  openWhatsApp(message);
}