# Keyword Density Checker

Analyze keyword frequency and density in text with stop-word filtering and a sortable results table, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/seo-tools/keyword-density

## How It Works

`analyze()` extracts all words with `text.toLowerCase().match(/\b[a-z]{2,}\b/g)` — requiring at least 2 characters to exclude single-letter words. Each word is checked against a 50-entry `STOP_WORDS` object (common articles, prepositions, pronouns, and auxiliaries) and skipped if found. The remaining words are counted in a `freq` object. Density is calculated as `freq[word] / total * 100`. Results are capped at 200 rows. The table is re-rendered on every column header click: column 0 (word) uses `localeCompare`, columns 1 and 2 use numeric comparison; direction toggles on repeated clicks. Each row shows the word, count, and a proportional density bar (max 80px) alongside the percentage.

## Features

- 50-word stop list (articles, prepositions, pronouns, auxiliaries)
- Minimum 2-character word filter
- Density bar visualization per keyword
- Sortable table by word, count, or density
- Total word count and unique keyword count display
- Results capped at 200 rows

## Browser APIs Used

- (No external APIs — pure DOM and regex)

## Code Structure

| File | Description |
|------|-------------|
| `keyword-density.js` | `/\b[a-z]{2,}\b/g` word extraction, 50-word `STOP_WORDS` filter, `freq/total*100` density, `renderTable` with 3-column click-sort |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| `#kdcInput` | Text input area |
| `#kdcAnalyze` | Analyze button |
| `#kdcClear` | Clear input and results |
| `#kdcStats` | Word and unique keyword count |
| `#kdcTableWrap` | Sortable keyword results table |

## License

MIT
