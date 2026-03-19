with open('src/pages/Account.jsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    "import { orderAPI, authAPI } from '../api/services'",
    "import { orderAPI, authAPI } from '../api/services'\nimport generateInvoice from '../utils/generateInvoice'"
)

# Add download button after order total
old = """                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-bold" style={{color:'var(--color-primary)'}}>₹{order.total?.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                      </div>"""

new = """                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-bold" style={{color:'var(--color-primary)'}}>₹{order.total?.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                          <button onClick={() => generateInvoice(order)} className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
                            📄 Invoice
                          </button>
                        </div>
                      </div>"""

content = content.replace(old, new)

with open('src/pages/Account.jsx', 'w') as f:
    f.write(content)
print("Account.jsx fixed!")
