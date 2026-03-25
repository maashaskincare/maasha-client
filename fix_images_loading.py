with open('src/components/product/ProductCard.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'src={product.images?.[0]?.url || \'/placeholder-product.jpg\'} alt={product.name} loading="lazy"',
    'src={product.images?.[0]?.url || \'/placeholder-product.jpg\'} alt={product.name} loading="eager"'
)

with open('src/components/product/ProductCard.jsx', 'w') as f:
    f.write(content)
print("Fixed!")
