import React from 'react';

type JsonLdData = Record<string, unknown>;

interface JsonLdProps {
  data: JsonLdData;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyHouz',
    url: 'https://myhouz.com',
    logo: 'https://myhouz.com/logo.png',
    description: 'Plateforme de rénovation et décoration pour votre maison',
    sameAs: [],
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}) {
  const data: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: product.url,
    },
  };
  if (product.rating && product.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }
  return data;
}

export function professionalJsonLd(pro: {
  name: string;
  description: string;
  url: string;
  city?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
}) {
  const data: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: pro.name,
    description: pro.description,
    url: pro.url,
    image: pro.image,
  };
  if (pro.city) {
    data.address = { '@type': 'PostalAddress', addressLocality: pro.city };
  }
  if (pro.rating && pro.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: pro.rating,
      reviewCount: pro.reviewCount,
    };
  }
  return data;
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: 'MyHouz' },
    publisher: {
      '@type': 'Organization',
      name: 'MyHouz',
      logo: { '@type': 'ImageObject', url: 'https://myhouz.com/logo.png' },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
