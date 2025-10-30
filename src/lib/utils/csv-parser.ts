export type ParsedData = {
  headers: string[]
  rows: Record<string, any>[]
}

export async function parseCSV(file: File): Promise<ParsedData> {
  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  if (lines.length === 0) {
    throw new Error("File is empty")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows: Record<string, any>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""
      row[header] = isNaN(Number(value)) ? value : Number(value)
    })

    rows.push(row)
  }

  return { headers, rows }
}

export async function parseExcel(file: File): Promise<ParsedData> {
  // For Excel files, we'll use a simple approach
  // In production, you'd use a library like xlsx
  throw new Error("Excel parsing requires additional setup. Please use CSV files for now.")
}

export function getNumericColumns(data: ParsedData): string[] {
  if (data.rows.length === 0) return []

  const firstRow = data.rows[0]
  return data.headers.filter((header) => typeof firstRow[header] === "number")
}

export function getCategoricalColumns(data: ParsedData): string[] {
  if (data.rows.length === 0) return []

  const firstRow = data.rows[0]
  return data.headers.filter((header) => typeof firstRow[header] === "string")
}
