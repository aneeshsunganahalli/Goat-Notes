# 🐐 Goat Notes

**Goat Notes** is a simple and powerful note-taking app built with **Next.js**, **Supabase**, and **Prisma**. It offers real-time syncing, AI-powered insights, and a smooth user experience for managing your notes across devices.

## ✨ Features

- ✍️ **CRUD Notes** – Create, read, update, and delete your notes effortlessly.
- 🤖 **AI Insights with Gemini LLM** – Ask questions about your notes and get instant answers or summaries.
- 🔄 **Real-time Sync** – Your notes stay updated across all devices thanks to Supabase's real-time features.
- 🔐 **Authentication** – Secure login and sign-up using Supabase Auth.
- 📦 **Database ORM with Prisma** – Clean and scalable database integration.

## 🛠 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Supabase](https://supabase.com/) (Auth, DB, Realtime)
- **ORM:** [Prisma](https://www.prisma.io/)
- **AI Integration:** [Gemini LLM](https://deepmind.google/technologies/gemini/)
- **Styling:** Tailwind CSS (or your preferred styling library)

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/goat-notes.git
cd goat-notes

# Install dependencies
npm install

# Create .env.local file and add your Supabase and Gemini API keys
cp .env.example .env.local

# Run the development server
npm run dev
