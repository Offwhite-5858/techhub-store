import siteConfig from "@/data/siteConfig";

// Organization schema for the homepage
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechHub Store",
    url: "https://techhub-store.vercel.app",
    logo: "https://techhub-store.vercel.app/og-image.png",
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [],
  };
}

// Product schema for product detail pages
export function generateProductSchema(product) {
  const ourPrice = product.our_price || product.ourPrice || 0;
  const marketPrice = product.market_price || product.marketPrice || 0;
  const inStock = product.in_stock !== false && product.stock_count > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    brand: {
      "@type": "Brand",
      name: product.brand || "TechHub",
    },
    image: product.image_url || product.imageUrl || "",
    sku: `TH-${product.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: ourPrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      url: `https://techhub-store.vercel.app/products/${product.id}`,
      seller: {
        "@type": "Organization",
        name: "TechHub Store",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "NGN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "NG",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "200",
    },
  };
}

// Breadcrumb schema
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ schema
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}