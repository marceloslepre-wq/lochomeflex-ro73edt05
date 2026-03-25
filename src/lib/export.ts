export function downloadCSV(filename: string, headers: string[], data: any[][]) {
  const csv = [
    headers.join(','),
    ...data.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function handleExport(
  format: 'csv' | 'pdf',
  filename: string,
  headers: string[],
  data: any[][],
) {
  if (format === 'csv') {
    downloadCSV(`${filename}.csv`, headers, data)
  } else {
    // Basic fallback for PDF export on frontend only
    window.print()
  }
}
