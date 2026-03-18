import { Helmet } from 'react-helmet-async'
import { SEO_DEFAULTS, BRAND } from '../../constants'

export default function SEO({ title, description, keywords, canonical, image, type = 'website', schema, noIndex = false }) {
  const fullTitle    = title       ? `${title} | Maasha Skin Care` : SEO_DEFAULTS.title
  const desc         = description || SEO_DEFAULTS.description
  const kw           = keywords    || SEO_DEFAULTS.keywords
  const img          = image       || SEO_DEFAULTS.image
  const canonicalUrl = canonical   ? `${BRAND.website}${canonical}` : BRAND.website

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords"    content={kw} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image"       content={img} />
      <meta property="og:locale"      content="en_IN" />
      <meta property="og:site_name"   content="Maasha Skin Care" />
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={img} />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: 'Maasha Skin Care', alternateName: 'Beauty Secret',
    description: 'Science-backed skincare with natural active ingredients for Indian skin',
    url: BRAND.website, telephone: BRAND.phone[0], email: BRAND.email,
    address: { '@type': 'PostalAddress', streetAddress: '30, Patarkaar Colony, Link Road No. 3', addressLocality: 'Bhopal', addressRegion: 'Madhya Pradesh', postalCode: '462003', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: 23.2599, longitude: 77.4126 },
    areaServed: 'IN', priceRange: '₹₹',
  }
}

export function productSchema(product) {
  return {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.shortDescription || product.description,
    image: product.images?.map(i => i.url) || [], sku: product.sku,
    brand: { '@type': 'Brand', name: 'Maasha Skin Care' },
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${BRAND.website}/product/${product.slug}` },
    aggregateRating: product.ratings?.count > 0 ? { '@type': 'AggregateRating', ratingValue: product.ratings.average.toFixed(1), reviewCount: product.ratings.count, bestRating: '5', worstRating: '1' } : undefined,
  }
}

export function articleSchema(blog) {
  return {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: blog.title, description: blog.metaDescription || blog.excerpt,
    image: blog.featuredImage,
    author: { '@type': 'Person', name: blog.author || 'Maasha Skin Care' },
    publisher: { '@type': 'Organization', name: 'Maasha Skin Care', logo: { '@type': 'ImageObject', url: `${BRAND.website}/logo.png` } },
    datePublished: blog.publishedAt, dateModified: blog.updatedAt || blog.publishedAt,
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url ? `${BRAND.website}${item.url}` : undefined })),
  }
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  }
}
