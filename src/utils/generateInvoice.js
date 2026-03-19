import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function generateInvoice(order) {
  const doc = new jsPDF()
  const GREEN  = [45, 90, 39]
  const GOLD   = [184, 134, 11]
  const BLACK  = [26, 26, 26]
  const GRAY   = [102, 102, 102]
  const LGRAY  = [249, 249, 249]
  const WHITE  = [255, 255, 255]

  const pageW = doc.internal.pageSize.getWidth()

  doc.setFillColor(...GREEN)
  doc.rect(0, 0, pageW, 40, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...WHITE)
  doc.text('MAASHA', 15, 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 215, 100)
  doc.text('SKIN CARE', 15, 25)

  doc.setFontSize(8)
  doc.setTextColor(200, 230, 200)
  doc.text('Reveal Your Natural Radiance', 15, 32)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...WHITE)
  doc.text('INVOICE', pageW - 15, 18, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 230, 200)
  doc.text(`#${order.orderNumber || order._id?.slice(-6).toUpperCase()}`, pageW - 15, 26, { align: 'right' })

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  doc.text(`Date: ${dateStr}`, pageW - 15, 33, { align: 'right' })

  let y = 52
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BLACK)
  doc.setFontSize(9)
  doc.text('Beauty Secret', 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.setFontSize(8)
  doc.text('30, Patarkaar Colony, Link Road No. 3', 15, y + 6)
  doc.text('Bhopal, MP – 462003, India', 15, y + 12)
  doc.text('Phone: +91 9646233903', 15, y + 18)
  doc.text('Email: maashaskincare@gmail.com', 15, y + 24)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREEN)
  doc.setFontSize(9)
  doc.text('BILL TO:', pageW / 2, y)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BLACK)
  doc.text(order.shippingAddress?.fullName || 'Customer', pageW / 2, y + 6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.setFontSize(8)
  const addr = order.shippingAddress
  if (addr) {
    doc.text(addr.line1 || '', pageW / 2, y + 12)
    if (addr.line2) doc.text(addr.line2, pageW / 2, y + 18)
    doc.text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, pageW / 2, addr.line2 ? y + 24 : y + 18)
    doc.text(`Phone: ${addr.phone || ''}`, pageW / 2, addr.line2 ? y + 30 : y + 24)
  }

  y = 90
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.5)
  doc.line(15, y, pageW - 15, y)

  y = 98
  const badges = [
    { label: 'Order Number', value: `#${order.orderNumber || order._id?.slice(-6).toUpperCase()}` },
    { label: 'Payment Method', value: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment' },
    { label: 'Payment Status', value: order.paymentStatus === 'paid' ? 'PAID' : order.paymentMethod === 'cod' ? 'COD' : 'PENDING' },
    { label: 'Order Status', value: (order.status || 'pending').toUpperCase() },
  ]

  const badgeW = (pageW - 30) / 4
  badges.forEach((badge, i) => {
    const bx = 15 + i * badgeW
    doc.setFillColor(...LGRAY)
    doc.roundedRect(bx, y - 6, badgeW - 3, 18, 2, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.setFontSize(7)
    doc.text(badge.label, bx + (badgeW - 3) / 2, y + 1, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    const valColor = badge.value === 'PAID' ? [67, 160, 71] : badge.value === 'COD' ? [...GOLD] : [...BLACK]
    doc.setTextColor(...valColor)
    doc.text(badge.value, bx + (badgeW - 3) / 2, y + 8, { align: 'center' })
  })

  y = 124
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREEN)
  doc.setFontSize(10)
  doc.text('ORDER ITEMS', 15, y)

  y = 128
  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
    body: (order.items || []).map((item, i) => [
      i + 1,
      item.name,
      item.qty,
      `Rs.${item.price?.toLocaleString('en-IN')}`,
      `Rs.${(item.price * item.qty)?.toLocaleString('en-IN')}`,
    ]),
    headStyles: {
      fillColor: GREEN,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
    },
    bodyStyles: { fontSize: 8, textColor: BLACK },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', cellWidth: 95 },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 30 },
    },
    alternateRowStyles: { fillColor: LGRAY },
    margin: { left: 15, right: 15 },
    theme: 'grid',
  })

  const finalY = doc.lastAutoTable.finalY + 8
  const totalsX = pageW - 80

  const totalsData = [['Subtotal', `Rs.${order.subtotal?.toLocaleString('en-IN') || 0}`]]
  if (order.discount > 0) {
    totalsData.push([`Discount`, `-Rs.${order.discount?.toLocaleString('en-IN')}`])
  }
  totalsData.push(['Shipping', order.shipping === 0 ? 'FREE' : `Rs.${order.shipping}`])

  autoTable(doc, {
    startY: finalY,
    body: totalsData,
    bodyStyles: { fontSize: 8, textColor: GRAY },
    columnStyles: {
      0: { halign: 'left', cellWidth: 40 },
      1: { halign: 'right', cellWidth: 25 },
    },
    margin: { left: totalsX - 5, right: 15 },
    theme: 'plain',
  })

  const totalY = doc.lastAutoTable.finalY + 4
  doc.setFillColor(...GREEN)
  doc.roundedRect(totalsX - 15, totalY, 75, 14, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9)
  doc.text('TOTAL', totalsX - 10, totalY + 9)
  doc.setFontSize(11)
  doc.text(`Rs.${order.total?.toLocaleString('en-IN')}`, pageW - 17, totalY + 9, { align: 'right' })

  const noteY = totalY + 24
  doc.setFillColor(240, 247, 239)
  doc.roundedRect(15, noteY, pageW - 30, 20, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREEN)
  doc.setFontSize(9)
  doc.text('Thank you for shopping with Maasha Skin Care!', pageW / 2, noteY + 8, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.setFontSize(8)
  doc.text('For queries: maashaskincare@gmail.com | +91 9646233903', pageW / 2, noteY + 14, { align: 'center' })

  const footerY = doc.internal.pageSize.getHeight() - 12
  doc.setDrawColor(...LGRAY)
  doc.setLineWidth(0.3)
  doc.line(15, footerY - 4, pageW - 15, footerY - 4)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.setFontSize(7)
  doc.text('Maasha Skin Care | Beauty Secret | 30, Patarkaar Colony, Bhopal, MP – 462003', pageW / 2, footerY, { align: 'center' })
  doc.text(`Invoice generated on ${new Date().toLocaleDateString('en-IN')}`, pageW / 2, footerY + 5, { align: 'center' })

  const fileName = `Maasha-Invoice-${order.orderNumber || order._id?.slice(-6)}.pdf`
  doc.save(fileName)
}
