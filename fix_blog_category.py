with open('src/pages/BlogPost.jsx', 'r') as f:
    content = f.read()

# Fix category - extract name if object
content = content.replace(
    "blogAPI.getAll({ category: p.category, limit: 3 })",
    "blogAPI.getAll({ category: p.category?.name || p.category, limit: 3 })"
)

content = content.replace(
    "{post.category && <><Link to={`/blog?category=${post.category}`} className=\"hover:text-green-500\">{post.category}</Link><span>/</span></>}",
    "{post.category && <><Link to={`/blog?category=${typeof post.category === 'object' ? post.category.name : post.category}`} className=\"hover:text-green-500\">{typeof post.category === 'object' ? post.category.name : post.category}</Link><span>/</span></>}"
)

content = content.replace(
    "{post.category && <Link to={`/blog?category=${post.category}`} className=\"inline-block badge-green text-xs mb-3\">{post.category}</Link>}",
    "{post.category && <Link to={`/blog?category=${typeof post.category === 'object' ? post.category.name : post.category}`} className=\"inline-block badge-green text-xs mb-3\">{typeof post.category === 'object' ? post.category.name : post.category}</Link>}"
)

with open('src/pages/BlogPost.jsx', 'w') as f:
    f.write(content)
print("Done!")
