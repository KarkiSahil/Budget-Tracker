# Ledger — Budget Tracker

A sleek, dark personal finance web app. Track your budget vs. spending across categories with charts, trends, and full data control.

## Features

- **Dashboard** — monthly summary, budget progress bars, quick-add transactions
- **Transactions** — full list with search, filter, sort, inline editing
- **Analytics** — 6-month trend line, pie chart, category breakdown bar chart
- **Categories** — custom categories with color picker, budget per category
- **Settings** — currency selector, JSON export/import, data reset
- **Persistent** — all data saved to `localStorage`, no backend needed
- **Responsive** — mobile sidebar, works on all screen sizes

## Tech Stack

- React 18 + React Router 6
- Recharts (charts)
- Lucide React (icons)
- CSS Modules
- Vite (build tool)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy that folder anywhere.

## Deploy Options

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop the dist/ folder to netlify.com/drop
```

### GitHub Pages
Add to `vite.config.js`:
```js
base: '/your-repo-name/'
```
Then push to GitHub and enable Pages from the `dist` branch.

### Self-hosted (nginx)
```nginx
server {
  root /var/www/budget-tracker/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Data

All data is stored in your browser's `localStorage` under the key `budget_tracker_v1`.

Use **Settings → Export JSON** to back up your data and **Import JSON** to restore it.
