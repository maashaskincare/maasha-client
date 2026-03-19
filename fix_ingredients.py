with open('src/pages/ProductDetail.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "product.ingredients?.join(', ')||''",
    "(Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients||'')"
)

content = content.replace(
    "{(product.ingredients||[]).map(ing => (",
    "{(Array.isArray(product.ingredients) ? product.ingredients : (product.ingredients||'').split(',').map(s=>s.trim())).filter(Boolean).map(ing => ("
)

with open('src/pages/ProductDetail.jsx', 'w') as f:
    f.write(content)
print("Done!")
