with open('src/utils/generateInvoice.js', 'r') as f:
    content = f.read()

# Make the green total box wider
content = content.replace(
    "doc.roundedRect(totalsX - 5, totalY, 65, 14, 2, 2, 'F')",
    "doc.roundedRect(totalsX - 15, totalY, 75, 14, 2, 2, 'F')"
)

# Move TOTAL label left
content = content.replace(
    "doc.text('TOTAL', totalsX, totalY + 9)",
    "doc.text('TOTAL', totalsX - 10, totalY + 9)"
)

with open('src/utils/generateInvoice.js', 'w') as f:
    f.write(content)
print("Fixed!")
