# Project Wajibu — Written Summary

## Problem

Kenyan county tender notices and budget documents are legally public but practically inaccessible. They are written in dense procurement and legal English, with critical details — deadlines, eligibility categories, contact information — buried deep in multi-page PDFs.

For a small supplier in Nyeri, a youth group eligible for a reserved tender, or a resident who wants to question spending, these documents are effectively closed. The result is not just confusion. It is exclusion: opportunities meant for local and marginalized bidders circulate instead among a small, well-connected set of firms, and citizens cannot meaningfully scrutinize how public money is used.

## Intended Users

- **Primary:** Small local suppliers and jua kali businesses in Nyeri County who want to bid but cannot parse tender notices
- **Secondary:** Youth and women's groups eligible for reserved tenders who don't know they qualify
- **Tertiary:** Residents, community journalists, and oversight bodies who want to scrutinize public spending

## How Wajibu Works

Wajibu is a web app that takes a real county tender or budget PDF and returns:

1. A plain-language summary in **English or Swahili**
2. **Extracted key details** — tender number, deadline, eligibility, value, contact
3. A **jargon buster** that explains any technical term in plain language
4. **Red flags** — such as unusually short deadlines or restrictive eligibility — each with a source citation
5. **Clear next steps** — who to ask, who to report to, where to learn more

The pipeline is: PDF → text extraction (pdfjs-dist in the browser) → Vercel serverless function → Gemini (with separate English and Swahili prompts) → structured JSON → accessible UI. Every summary claim cites the source page and quote, so users can verify.

The proof of concept is built with Vite, React, TypeScript, and Tailwind, deployed on Vercel, and uses real Nyeri County documents.

## Real-World Conditions Considered

- **Trust and verification:** every claim links to the source document; the system is explicitly instructed never to invent facts
- **Low bandwidth:** lightweight pages; SMS/USSD fallback planned
- **Accessibility:** WCAG-aware design, large-type option, plain language
- **Privacy:** no login required to read; queries are not tied to identity
- **Multilingual access:** Swahili and English at launch; Kikuyu on the roadmap
- **Local relevance:** real Nyeri County tender and budget documents
- **Clear next steps:** every result ends with a named action — ask your MCA, report to PPRA or EACC

## Why It Is Worth Developing Further

Access to information is not the same as ability to understand it. Wajibu closes that gap for the documents that most directly affect people's economic and civic lives: tenders and budgets. By making these documents legible in the languages people actually speak, Wajibu can widen tender participation, reduce the sidelining of local and marginalized bidders, and give citizens a practical tool for accountability.

This proof of concept demonstrates the full flow on real Nyeri County documents. The next step is a pilot with one county assembly, followed by SMS/USSD access, Kikuyu language support, and a community verification layer.

---

*Project Wajibu was created for the Andela × Open Society Foundations civic tech invention sprint, September 2026. It is an original concept. AI tools were used to support development, but the core idea, problem framing, and design are the author's own.*
