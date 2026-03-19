with open('src/pages/admin/Products.jsx', 'r') as f:
    content = f.read()

old = '<Link to={`/admin/products/${p._id}`} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Edit</Link>'
new = '<Link to={`/admin/products/${p._id}`} state={{ product: p }} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Edit</Link>'

content = content.replace(old, new)

with open('src/pages/admin/Products.jsx', 'w') as f:
    f.write(content)
print("Products.jsx fixed!")
