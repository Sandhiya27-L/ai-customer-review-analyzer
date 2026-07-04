import jsPDF from 'jspdf';

export function exportToJson(data, filename = 'analysis.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export function exportToCsv(analysis, filename = 'analysis.csv') {
  const rows = [
    ['Field', 'Value'],
    ['Summary', analysis.summary || ''],
    ['Positive Sentiment', analysis.sentiment?.positive ?? ''],
    ['Neutral Sentiment', analysis.sentiment?.neutral ?? ''],
    ['Negative Sentiment', analysis.sentiment?.negative ?? ''],
    ['Positive Points', (analysis.positivePoints || []).join('; ')],
    ['Negative Points', (analysis.negativePoints || []).join('; ')],
    ['Complaints', (analysis.complaints || []).join('; ')],
    ['Features', (analysis.features || []).join('; ')],
    ['Keywords', (analysis.keywords || []).join('; ')],
    ['Suggestions', (analysis.suggestions || []).join('; ')],
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, filename);
}

export function exportToPdf(analysis, filename = 'analysis.pdf') {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;

  const addLine = (text, bold = false) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 14, y);
    y += lines.length * lineHeight;
  };

  addLine('AI Customer Review Analysis Report', true);
  y += 4;
  addLine(`Summary: ${analysis.summary || 'N/A'}`, true);
  y += 2;
  addLine(`Sentiment - Positive: ${analysis.sentiment?.positive}% | Neutral: ${analysis.sentiment?.neutral}% | Negative: ${analysis.sentiment?.negative}%`);
  y += 4;

  const sections = [
    ['Positive Points', analysis.positivePoints],
    ['Negative Points', analysis.negativePoints],
    ['Common Complaints', analysis.complaints],
    ['Appreciated Features', analysis.features],
    ['Keywords', analysis.keywords],
    ['Suggestions', analysis.suggestions],
  ];

  sections.forEach(([title, items]) => {
    addLine(title, true);
    (items || []).forEach((item, index) => addLine(`${index + 1}. ${item}`));
    y += 4;
  });

  doc.save(filename);
}

export async function copyAnalysisToClipboard(analysis) {
  const text = [
    `Summary: ${analysis.summary}`,
    '',
    `Sentiment: +${analysis.sentiment?.positive}% / ~${analysis.sentiment?.neutral}% / -${analysis.sentiment?.negative}%`,
    '',
    'Positive Points:',
    ...(analysis.positivePoints || []).map((p) => `- ${p}`),
    '',
    'Negative Points:',
    ...(analysis.negativePoints || []).map((p) => `- ${p}`),
    '',
    'Suggestions:',
    ...(analysis.suggestions || []).map((p) => `- ${p}`),
  ].join('\n');

  await navigator.clipboard.writeText(text);
}

function escapeCsv(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const reviews = lines.slice(1).map((line) => {
        const match = line.match(/^"(.*)"$|^([^,]+)/);
        return match ? (match[1] || match[2] || '').replace(/""/g, '"') : line;
      });
      resolve(reviews.join('\n\n'));
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
