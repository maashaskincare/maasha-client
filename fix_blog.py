with open('src/pages/BlogPost.jsx', 'r') as f:
    content = f.read()

# Fix 1: tags.join
content = content.replace(
    "post.seoKeywords || post.tags?.join(', ')",
    "post.seoKeywords || (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags||'')"
)

# Fix 2: tags.length check
content = content.replace(
    "{post.tags?.length > 0 && (",
    "{(Array.isArray(post.tags) ? post.tags.length > 0 : !!post.tags) && ("
)

# Fix 3: tags.map
content = content.replace(
    "{post.tags.map(tag => (",
    "{(Array.isArray(post.tags) ? post.tags : (post.tags||'').split(',').map(s=>s.trim())).filter(Boolean).map(tag => ("
)

with open('src/pages/BlogPost.jsx', 'w') as f:
    f.write(content)
print("Done!")
