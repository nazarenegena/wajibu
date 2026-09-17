# Project Wajibu — Written Summary

**Track:** Transparency & Accountability
**Live app:** [wajibu.vercel.app](https://wajibu.vercel.app)
**Repository:** [github.com/nazarenegena/wajibu](https://github.com/nazarenegena/wajibu)

---

## Problem

Kenyan county tender notices and budget documents are legally public but practically inaccessible. They are written in dense procurement and legal English, with critical details — deadlines, eligibility categories, contact information — buried deep in multi-page PDFs.

For a small supplier in Nyeri, a youth group eligible for a reserved tender, or a resident who wants to question spending, these documents are effectively closed. The result is not just confusion. It is exclusion: opportunities meant for local and marginalized bidders circulate instead among a small, well-connected set of firms, and citizens cannot meaningfully scrutinize how public money is used.

The gap is not access to information. The gap is the ability to understand it.

---

## Intended Users

- **Primary:** Small local suppliers and *jua kali* businesses in Nyeri County who want to bid but cannot parse tender notices
- **Secondary:** Youth and women's groups eligible for reserved tenders who don't know they qualify
- **Tertiary:** Residents, community journalists, and oversight bodies who want to scrutinize public spending

Each of these users has the same underlying need: a document written in plain language, in a language they speak, on a device they own.

---

## How Wajibu Works

Wajibu is a web app that takes a real county tender or budget PDF and returns:

1. A **plain-language summary** in English or Swahili
2. **Extracted key details** — tender number, deadline, eligibility, value, contact
3. A **jargon buster** that explains any technical term in plain language
4. **Red flags** — such as unusually short deadlines or restrictive eligibility — each with a source citation
5. **Clear next steps** — who to ask, who to report to, where to learn more

The pipeline is:
PDF → text extraction (pdfjs-dist, in the browser) → Vercel serverless function
→ Gemini (separate English and Swahili prompts) → structured JSON → accessible UI


Every summary claim and red flag cites the source passage. A "Show original text" control reveals the exact quote each claim was based on, so users can verify rather than trust.

The proof of concept is built with Vite, React, TypeScript, Tailwind, and shadcn/ui, deployed on Vercel, and uses real Nyeri County documents.

---

## Real-World Conditions Considered

The hackathon brief asked designs to consider trust, low bandwidth, accessibility, privacy, multilingual access, local relevance, and clear next steps. Each is addressed by a specific, visible feature:

| Condition | How Wajibu meets it |
|---|---|
| **Trust & verification** | Every summary and red flag carries a source citation. "Show original text" reveals the source passage on demand. The prompt explicitly forbids invention — if something is not in the document, the model says *"Not stated in this document."* |
| **Low bandwidth** | Text-only mode strips visuals and reduces page size. An SMS preview shows the ≤160-character summary a feature-phone user receives, with a mock conversation showing follow-up. Offline app shell via service worker. |
| **Accessibility** | WCAG-aware semantics, skip-to-content link, three selectable text sizes (standard / large / extra-large), keyboard-navigable, high-contrast in both light and dark themes. |
| **Privacy** | No login to read. No tracking. PDFs are parsed in the browser — only extracted text reaches the server. Queries are not tied to identity. |
| **Multilingual access** | Swahili and English at launch, with a persistent toggle. Kikuyu on the roadmap. |
| **Local relevance** | Real Nyeri County tender and budget documents. Named oversight bodies: Nyeri County Assembly, PPRA, EACC. |
| **Clear next steps** | Every result ends with named actions: ask your MCA, report to PPRA or EACC, contact the procurement office. |

---

## Why It Is Worth Developing Further

Access to information is not the same as ability to understand it. Wajibu closes that gap for the documents that most directly affect people's economic and civic lives: tenders and budgets. By making these documents legible in the languages people actually speak, Wajibu can widen tender participation, reduce the sidelining of local and marginalized bidders, and give citizens a practical tool for accountability.

This proof of concept demonstrates the full flow on real Nyeri County documents. The next step is a pilot with one county assembly, followed by SMS/USSD access, Kikuyu language support, and a community verification layer where citizens can flag and confirm summaries.

---

## Originality

The idea, problem framing, and design of Wajibu are the author's own. AI tools were used to support development, Google Gemini for the app's summarisation, and AI coding assistants for the build, as permitted by the hackathon rules. No AI tool generated the core concept.

---

*Project Wajibu was created for the Andela × Open Society Foundations civic tech invention sprint, September 2026.*
