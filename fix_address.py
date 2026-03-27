import os

files = [
    'src/constants.js',
    'src/components/layout/Footer.jsx',
    'src/components/common/SEO.jsx',
    'src/utils/generateInvoice.js',
    'src/pages/PrivacyPolicy.jsx',
    'src/pages/Contact.jsx',
]

replacements = [
    ("30, Patarkaar Colony, Link Road No. 3, Bhopal, MP – 462003", "Maasha Skin Care, Kara Unisex Salon, 335 Mandakini, Kolar Road, near Rudraksha Hospital, Bhopal, MP – 462042"),
    ("30, Patarkaar Colony,<br />Link Road No. 3,<br />Bhopal, MP – 462003", "Maasha Skin Care, Kara Unisex Salon,<br />335 Mandakini, Kolar Road,<br />Near Rudraksha Hospital,<br />Bhopal, MP – 462042"),
    ("streetAddress: '30, Patarkaar Colony, Link Road No. 3'", "streetAddress: 'Kara Unisex Salon, 335 Mandakini, Kolar Road'"),
    ("postalCode: '462003'", "postalCode: '462042'"),
    ("30, Patarkaar Colony, Link Road No. 3", "Kara Unisex Salon, 335 Mandakini, Kolar Road"),
    ("Bhopal, MP – 462003, India", "Near Rudraksha Hospital, Bhopal, MP – 462042, India"),
    ("Bhopal, MP – 462003", "Near Rudraksha Hospital, Bhopal, MP – 462042"),
    ("Beauty Secret, 30 Patarkaar Colony, Link Road No. 3, Bhopal, MP – 462003", "Maasha Skin Care, Kara Unisex Salon, 335 Mandakini, Kolar Road, Bhopal, MP – 462042"),
    ("30, Patarkaar Colony,<br />Link Road No. 3,<br />Bhopal, MP – 462003", "Kara Unisex Salon, 335 Mandakini,<br />Kolar Road, Near Rudraksha Hospital,<br />Bhopal, MP – 462042"),
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)
    if content != original:
        print(f"✅ Updated: {filepath}")
    else:
        print(f"⚠️  No change: {filepath}")
