# Lab 7 — CSV Ingestion & Visualization (Summary)

This document summarizes Lab 7 and provides a small verification script that demonstrates CSV parsing and column role detection using the sample CSV files included in this repository (`models_csv/`).

## Goals
- Parse CSV files (comma/semicolon/TSV detection)
- Normalize headers (trim, remove quotes, case-insensitive mapping)
- Detect numeric vs categorical columns
- Provide a minimal verification script to exercise the parsing logic and show example outputs

## Files of interest
- `models_csv/test-data-timeseries.csv` — time-series sample
- `models_csv/test-data-multiseries.csv` — multi-series numeric data
- `models_csv/test-data-bar.csv` — categorical/bar sample

## How to run the quick verification locally

1. Install dependencies (if needed):

```powershell
npm install
```

2. Run the verification script (node):

```powershell
npm run lab7:verify
```

## What the script does
- Reads the CSV files found in `models_csv/`
- Autodetects the delimiter (comma, semicolon, or tab)
- Prints headers, number of rows, numeric columns, categorical columns, and the first 3 rows as examples

## Notes and next steps
- The app already contains a browser-side CSV parser at `src/lib/utils/csv-parser.ts` that expects a `File` object; the verification script is a small Node helper for running on the filesystem.
- If you want, I can integrate the improved delimiter autodetection into the app parser and add unit tests.

If you'd like me to implement the autodetection into the UI flow and add test coverage, tell me and I'll proceed to update `src/lib/utils/csv-parser.ts` and add tests.
