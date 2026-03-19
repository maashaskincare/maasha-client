with open('src/utils/generateInvoice.js', 'r') as f:
    content = f.read()

# Make box full width from totalsX to page edge
old = """  const totalY = doc.lastAutoTable.finalY + 4
  doc.setFillColor(...GREEN)
  doc.roundedRect(totalsX - 15, totalY, 75, 14, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9)
  doc.text('TOTAL', totalsX - 10, totalY + 9)
  doc.setFontSize(11)
  doc.text(`Rs.${order.total?.toLocaleString('en-IN')}`, pageW - 17, totalY + 9, { align: 'right' })"""

new = """  const totalY = doc.lastAutoTable.finalY + 4
  doc.setFillColor(...GREEN)
  doc.roundedRect(15, totalY, pageW - 30, 14, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('GRAND TOTAL', 25, totalY + 9)
  doc.setFontSize(11)
  doc.text(`Rs. ${order.total?.toLocaleString('en-IN')}`, pageW - 17, totalY + 9, { align: 'right' })"""

content = content.replace(old, new)

with open('src/utils/generateInvoice.js', 'w') as f:
    f.write(content)
print("Fixed!")
