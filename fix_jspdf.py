with open('src/utils/generateInvoice.js', 'r') as f:
    content = f.read()

content = content.replace(
    "import jsPDF from 'jspdf'\nimport 'jspdf-autotable'",
    "import { jsPDF } from 'jspdf'\nimport autoTable from 'jspdf-autotable'"
)

content = content.replace(
    "doc.autoTable({",
    "autoTable(doc, {"
)

with open('src/utils/generateInvoice.js', 'w') as f:
    f.write(content)
print("Fixed!")
