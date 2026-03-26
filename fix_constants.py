with open('src/constants.js', 'r') as f:
    content = f.read()

content = content.replace(
    "phone:    ['+91 9244142410],",
    "phone:    ['+91 9244142410'],"
)

with open('src/constants.js', 'w') as f:
    f.write(content)
print("Fixed!")
