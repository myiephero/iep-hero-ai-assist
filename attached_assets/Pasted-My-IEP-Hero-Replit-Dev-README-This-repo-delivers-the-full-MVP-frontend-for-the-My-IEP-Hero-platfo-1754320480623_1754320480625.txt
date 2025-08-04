My IEP Hero – Replit Dev README

This repo delivers the full MVP frontend for the My IEP Hero platform, focused on advocacy + SaaS tools for families navigating special education.

⸻

🔧 Tech Stack
	•	Frontend: React + TailwindCSS (Replit-hosted)
	•	Backend: Supabase (auth, DB, storage)
	•	AI Help Layer: Emergent SDK (chat assistant)
	•	Workflow Automation: Rork (task triggers, notifications)

⸻

📂 Folder Structure

my-iephero/
├── public/
│   └── index.html (embed Emergent widget)
├── src/
│   ├── components/
│   │   └── HeroOfferForm.jsx
│   │   └── ParentDashboard.jsx
│   │   └── AdvocateDashboard.jsx
│   │   └── EmergentChat.jsx
│   ├── api/
│   │   └── supabaseClient.js
│   │   └── rorkActions.js
│   ├── App.jsx
│   └── index.js
├── tailwind.config.js
├── .env
└── README.md


⸻

✅ Core Features To Implement

Parent UI
	•	Hero Offer intake form → writes to Supabase intakes table
	•	Dashboard with:
	•	Document upload (Supabase Storage)
	•	Smart letter builder (form → PDF)
	•	Emergent widget (chat about rights)
	•	Timeline tracker (based on Rork status updates)

Advocate UI
	•	List of assigned cases (read from intakes)
	•	View and comment on uploaded docs
	•	Upload custom templates (optional)

Automation
	•	Rork triggers when:
	•	Intake submitted → auto-assign advocate
	•	IEP date entered → email reminders
	•	Status updates: “In Review”, “Meeting Scheduled”, “Complete”

⸻

🔑 Environment Variables (.env)

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
EMERGENT_PROJECT_ID=...
RORK_API_KEY=...


⸻

🚀 To Launch in Replit
	1.	Import this repo into a Replit React + Vite project
	2.	Add TailwindCSS support
	3.	Connect Supabase and paste keys into .env
	4.	Paste Emergent widget snippet into public/index.html
	5.	Build each screen per the components listed
	6.	Test form → document upload → AI chat → PDF output → Rork trigger

⸻

📎 Resources
	•	Supabase Docs
	•	Emergent Docs
	•	Rork Automation Tool
	•	Tailwind CSS Guide

⸻

Questions? Ping @founder or @builder in the readme or internal Slack.