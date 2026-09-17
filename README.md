# Project Wajibu

**Making Nyeri County tenders and budgets understandable to everyone.**

Wajibu is a civic-tech proof of concept that turns dense Kenyan county tender notices and budget documents into plain Swahili and English — so residents, small suppliers, and local journalists can understand, question, and act on public spending.

> *Wajibu* (Swahili): responsibility, duty.

---

## The Problem

Public tender notices and county budget documents in Kenya are technically public, but practically unreadable. They are written in dense legal and procurement English, with deadlines and eligibility rules buried deep in PDFs. Most affected residents, including the small suppliers and youth who could bid, cannot decode them.

The result:
- Communities are sidelined from opportunities meant for them
- Tender participation stays concentrated among a few well-connected firms
- Citizens cannot meaningfully question public spending

This is not just a comprehension gap. It is exclusion by design.

---

## The Solution

Wajibu takes a real Nyeri County tender or budget PDF and produces:

1. **A plain-language summary** in English or Swahili
2. **Key details extracted** — tender number, deadline, eligibility, value, contact
3. **A jargon buster** — tap any technical term for a plain explanation
4. **Red flags** — unusual deadlines, sole-source language, restrictive eligibility — each with a source citation
5. **Clear next steps** — who to ask, who to report to, where to learn more

Every claim links back to the source document. Nothing is invented.

---

## How It Works

PDF upload → text extraction (pdfjs-dist) → /api/analyse → Gemini → structured JSON → UI



- **Frontend:** Vite + React + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **PDF extraction:** pdfjs-dist (browser-side)
- **LLM:** Google Gemini (free tier) via Vercel serverless function
- **Deploy:** Vercel

---

## Real-World Design Choices

| Constraint | How Wajibu meets it |
|---|---|
| Trust & verification | Every summary cites the source page and quote |
| Low bandwidth | Lightweight pages; offline app shell (service worker); SMS/USSD fallback planned |
| Accessibility | WCAG-aware design, skip-to-content link, three text sizes (standard/large/extra-large), plain language |
| Privacy | No login to read; queries not tied to identity |
| Multilingual | Swahili + English toggle; Kikuyu on roadmap |
| Local relevance | Real Nyeri County documents |
| Clear next steps | Named actions: ask your MCA, report to EACC/PPRA |

---

## Running Locally

```bash
git clone https://github.com/nazarenegena/wajibu.git
cd wajibu
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
npx vercel dev          # terminal 1
npm run dev             # terminal 2



Sample Documents
Real Nyeri County documents used in the demo are in public/samples/:

NYEWASCO Tender Notice

Nyeri County Finance Bill 2025 (Simplified)

Nyeri Irrigation Project Tender

What This Is Not
This is an invention sprint proof of concept, not a production product. It is not affiliated with Nyeri County Government. It does not accuse anyone of wrongdoing — it surfaces information for citizens to question responsibly.

Roadmap
□ Kikuyu & Kiswahili language support
□ SMS/USSD interface for low-bandwidth users
□ Direct integration with tenders.go.ke and county websites
□ Community verification layer (citizens flag and confirm summaries)
□ Pilot with one county assembly
License
MIT



---

## 6. `PITCH.md`

```markdown
# Project Wajibu — Pitch Deck

**10 slides, 3 minutes.**

---

## Slide 1 — Title
**Project Wajibu**
Making Nyeri County tenders understandable to everyone.
*Wajibu: responsibility.*

---

## Slide 2 — The Problem
Public tenders are technically public — but practically unreadable.
> [Screenshot of a real Nyeri tender with jargon highlighted]

Dense English. Legal terms. Deadlines on page 14.
Most affected people cannot decode them.

---

## Slide 3 — Who Is Affected
- **Small suppliers** who could bid but can't understand the notice
- **Youth and women** in reserved categories who don't know they qualify
- **Residents and journalists** who want to scrutinize spending
- **Communities** sidelined from opportunities meant for them

---

## Slide 4 — Why Now
- OSF's *Transformative Peace in Africa: Shifting Power to Communities*
- Kenya's access-to-information law exists — but access isn't the same as understanding
- AI now makes plain-language translation of complex documents possible at scale

---

## Slide 5 — The Solution
**Wajibu turns a tender PDF into plain Swahili and English in seconds.**
- Summary
- Key details
- Jargon buster
- Red flags (with sources)
- Next steps

---

## Slide 6 — Live Demo
[Screenshots of the app]
1. Select a real Nyeri tender
2. Plain-language summary appears
3. Toggle to Swahili
4. Tap "Framework Contract" → plain meaning
5. See flagged issue + source quote
6. Read next step: "Ask your MCA this question"

---

## Slide 7 — How It Works

PDF → extract → Gemini (EN/SW) → structured output → cited UI

Every claim cites the source. Nothing invented.

---

## Slide 8 — Real-World Design
- Low bandwidth (lightweight; SMS on roadmap)
- Swahili + English today; Kikuyu next
- WCAG-aware, large-type option
- No login, no tracking
- Real Nyeri documents

---

## Slide 9 — Impact & Next Steps
- **Now:** working PoC on real Nyeri documents
- **Next:** pilot with one county assembly
- **Then:** SMS/USSD, Kikuyu, community verification
- **Vision:** every Kenyan can understand and question public spending

---

## Slide 10 — Ask
Support to pilot Wajibu with Nyeri County Assembly and expand to 3 more counties.
**Public money should be publicly understood.**
