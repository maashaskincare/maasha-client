with open('src/pages/admin/OrderDetail.jsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    "import { orderAPI } from '../../api/services'",
    "import { orderAPI } from '../../api/services'\nimport generateInvoice from '../../utils/generateInvoice'"
)

# Add download button next to order title
old = """        <div>
          <button onClick={() => navigate('/admin/orders')} className="text-xs text-gray-400 hover:text-green-500 mb-1 flex items-center gap-1">← Back to Orders</button>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Order #{order.orderNumber}</h1>
        </div>
        <span className={`badge ${st?.color}`}>{order.status}</span>"""

new = """        <div>
          <button onClick={() => navigate('/admin/orders')} className="text-xs text-gray-400 hover:text-green-500 mb-1 flex items-center gap-1">← Back to Orders</button>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Order #{order.orderNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${st?.color}`}>{order.status}</span>
          <button onClick={() => generateInvoice(order)} className="btn-primary btn-sm text-xs flex items-center gap-1">📄 Download Invoice</button>
        </div>"""

content = content.replace(old, new)

with open('src/pages/admin/OrderDetail.jsx', 'w') as f:
    f.write(content)
print("OrderDetail.jsx fixed!")
