with open('src/pages/Checkout.jsx', 'r') as f:
    content = f.read()

# Remove COD from payment options
old = """                    {[
                      {value:'razorpay',label:'Pay Online',desc:'UPI, Cards, Net Banking, Wallets',icon:'💳'},
                      {value:'cod',label:'Cash on Delivery',desc:'Pay when your order arrives',icon:'💵'},
                    ].map(m => ("""

new = """                    {[
                      {value:'razorpay',label:'Pay Online',desc:'UPI, Cards, Net Banking, Wallets',icon:'💳'},
                    ].map(m => ("""

content = content.replace(old, new)

with open('src/pages/Checkout.jsx', 'w') as f:
    f.write(content)
print("COD removed!")
