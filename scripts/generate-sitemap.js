import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://maashaskincare.com';
const API_URL = 'https://maasha-api.onrender.com';

async function generateSitemap() {
  console.log('Starting sitemap generation...');
  
  const today = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/products', changefreq: 'daily', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/skin-quiz', changefreq: 'monthly', priority: '0.8' },
  ];

  let dynamicPages = [];

  try {
    const productsRes = await fetch(API_URL + '/api/products');
    if (productsRes.ok) {
      const data = await productsRes.json();
      const products = Array.isArray(data) ? data : (data.products || []);
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        dynamicPages.push({
          url: '/products/' + (p.slug || p._id),
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: today
        });
      }
      console.log('Added ' + products.length + ' products');
    }
  } catch (e) {
    console.log('Could not fetch products: ' + e.message);
  }

  try {
    const blogsRes = await fetch(API_URL + '/api/blogs');
    if (blogsRes.ok) {
      const data = await blogsRes.json();
      const blogs = Array.isArray(data) ? data : (data.blogs || []);
      for (let i = 0; i < blogs.length; i++) {
        const b = blogs[i];
        dynamicPages.push({
          url: '/blog/' + (b.slug || b._id),
          changefreq: 'monthly',
          priority: '0.7',
          lastmod: today
        });
      }
      console.log('Added ' + blogs.length + ' blogs');
    }
  } catch (e) {
    console.log('Could not fetch blogs: ' + e.message);
  }

  const allPages = staticPages.concat(dynamicPages);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    xml += '  <url>\n';
    xml += '    <loc>' + SITE_URL + page.url + '</loc>\n';
    xml += '    <lastmod>' + (page.lastmod || today) + '</lastmod>\n';
    xml += '    <changefreq>' + page.changefreq + '</changefreq>\n';
    xml += '    <priority>' + page.priority + '</priority>\n';
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';

  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  
  console.log('Sitemap generated! Total pages: ' + allPages.length);
}

generateSitemap();
