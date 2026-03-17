# Resume Tailor

AI-powered tool that tailors your resume to match specific job descriptions, increasing your chances of landing interviews.

## Features

- **Upload DOCX** — Drag-and-drop or browse to upload your existing resume
- **AI Tailoring** — Claude AI rewrites bullet points, adjusts keywords, and optimizes content for the target role
- **Live Editor** — Review and edit the tailored resume in a rich text editor with side-by-side comparison
- **Download** — Export as DOCX or PDF with professional formatting

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

## Quick Start

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start the app

In two separate terminals:

```bash
# Terminal 1 — Backend (port 3001)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Upload your current resume (.docx file)
2. Paste the full job description for the role you're targeting
3. Click **Tailor My Resume**
4. Review the AI-tailored version side-by-side with your original
5. Make any edits in the rich text editor
6. Download as DOCX or PDF

## Project Structure

```
├── client/          React frontend (Vite + TypeScript + TailwindCSS)
│   └── src/
│       ├── components/   UI components
│       ├── App.tsx        Main application
│       └── types.ts       TypeScript interfaces
├── server/          Express backend (TypeScript)
│   └── src/
│       ├── routes/        API endpoints
│       ├── services/      Business logic (parser, AI, generators)
│       └── types.ts       TypeScript interfaces
├── .env.example     Environment variable template
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse` | Upload and parse a DOCX file to HTML |
| POST | `/api/tailor` | Tailor resume HTML using Claude AI |
| POST | `/api/download/docx` | Generate and download DOCX |
| POST | `/api/download/pdf` | Generate and download PDF |

## Deployment

### Frontend (Vercel / Netlify)

```bash
cd client
npm run build
# Deploy the dist/ folder
```

Set the `VITE_API_URL` environment variable to your backend URL if deploying separately.

### Backend (Railway / Render / Fly.io)

```bash
cd server
npm run build
npm start
```

Set environment variables: `ANTHROPIC_API_KEY`, `PORT`, `CLIENT_URL`.

Note: PDF generation requires a headless Chrome environment. Railway and Render support this out of the box.
