with open('src/pages/BlogPost.jsx', 'r') as f:
    content = f.read()

# Fix author rendering
content = content.replace(
    "{post.author || 'Maasha Skin Care'}",
    "{typeof post.author === 'object' ? post.author?.name || 'Maasha Skin Care' : post.author || 'Maasha Skin Care'}"
)

with open('src/pages/BlogPost.jsx', 'w') as f:
    f.write(content)
print("Fixed!")
