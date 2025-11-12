#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

function detectDelimiter(line) {
  const counts = {
    ',': (line.match(/,/g) || []).length,
    ';': (line.match(/;/g) || []).length,
    '\t': (line.match(/\t/g) || []).length,
  }
  // choose delimiter with max count; fallback to comma
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return best && best[1] > 0 ? best[0] : ','
}

function parseText(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length === 0) return { headers: [], rows: [] }
  const delimiter = detectDelimiter(lines[0])
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''))
    const row = {}
    headers.forEach((h, idx) => {
      const val = values[idx] || ''
      row[h] = val === '' ? null : (isNaN(Number(val)) ? val : Number(val))
    })
    rows.push(row)
  }
  return { headers, rows }
}

function getNumericColumns(parsed) {
  if (!parsed.rows || parsed.rows.length === 0) return []
  const first = parsed.rows[0]
  return parsed.headers.filter((h) => typeof first[h] === 'number')
}

function getCategoricalColumns(parsed) {
  if (!parsed.rows || parsed.rows.length === 0) return []
  const first = parsed.rows[0]
  return parsed.headers.filter((h) => typeof first[h] === 'string' || first[h] === null)
}

async function run() {
  const dir = path.join(__dirname, '..', 'models_csv')
  try {
    const files = await fs.readdir(dir)
    const csvs = files.filter((f) => f.endsWith('.csv'))
    if (csvs.length === 0) {
      console.log('No CSV files found in models_csv/')
      return
    }
    for (const file of csvs) {
      const full = path.join(dir, file)
      const text = await fs.readFile(full, 'utf8')
      const parsed = parseText(text)
      console.log('---')
      console.log('File:', file)
      console.log('Rows:', parsed.rows.length)
      console.log('Headers:', parsed.headers.join(', '))
      console.log('Numeric columns:', getNumericColumns(parsed).join(', ') || '(none)')
      console.log('Categorical columns:', getCategoricalColumns(parsed).join(', ') || '(none)')
      console.log('First 3 rows sample:')
      console.log(parsed.rows.slice(0, 3))
      console.log('\n')
    }
  } catch (err) {
    console.error('Error running verification:', err)
    process.exit(1)
  }
}

run()
