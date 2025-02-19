// src/utils/exportUtils.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title, headers, data, additionalInfo = null) => {
  const doc = new jsPDF();
  
  // Agregar título
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Agregar fecha y hora
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 30);

  // Agregar información adicional si existe
  if (additionalInfo) {
    doc.setFontSize(12);
    Object.entries(additionalInfo).forEach(([key, value], index) => {
      doc.text(`${key}: ${value}`, 14, 40 + (index * 7));
    });
  }

  // Crear tabla
  doc.autoTable({
    head: [headers],
    body: data,
    startY: additionalInfo ? 60 : 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Guardar PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (title, data) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Ajustar ancho de columnas
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key]).length))
  }));
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};