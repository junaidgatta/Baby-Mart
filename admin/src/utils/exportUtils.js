import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * EXPORT TO EXCEL (XLSX)
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Desired file name (without extension)
 */
export const exportToExcel = (data, fileName = 'Baby-Mart-Report') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * EXPORT TO PDF
 * @param {Array} columns - Column headers (e.g. ['ID', 'Customer', 'Amount'])
 * @param {Array} rows - Row data as nested arrays (e.g. [['001', 'Ali', 'Rs 200']])
 * @param {String} title - Heading for the PDF
 * @param {String} fileName - Desired file name
 */
export const exportToPDF = (columns, rows, title = 'Baby Mart Report', fileName = 'Baby-Mart-Report') => {
  const doc = new jsPDF();
  
  // Custom Styling
  doc.setFontSize(20);
  doc.setTextColor(124, 111, 247); // Baby Mart Primary Purple
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

  // Using explicit autoTable function
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [124, 111, 247], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 255] },
  });

  doc.save(`${fileName}.pdf`);
};
