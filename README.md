# 🌷 Guru Chandrika

**Daily Parent Call Assistant**

A simple, modern, and teacher-friendly application built to help teachers efficiently communicate with parents, record call notes using voice, and maintain daily reports — designed with love for **mom**, a dedicated teacher.

---

## ✨ About the Project

**Guru Chandrika** is a React-based application (Web + Android compatible) that allows teachers to:

- View their class student list
- Call parents directly from the app
- Record call notes using **Telugu voice input**
- Automatically generate **English summaries**
- Save daily call reports for future reference

The app is optimized for **daily classroom use**, focusing on simplicity, clarity, and speed.

---

## 🎯 Why This App?

Teachers often:
- Call multiple parents every day
- Repeat the same follow-ups
- Forget small but important conversation details

This app solves that by acting as a **personal teaching assistant**, making parent communication organized and stress-free.

---

## 🚀 Features

### 👩‍🏫 Student Management
- Upload students via **CSV / XLSX**
- Supports **multiple phone numbers per student**
- One student card with multiple CALL buttons
- Filter by class
- Search by student or parent name
- Sort A–Z / Z–A

### 📞 Smart Calling
- One-tap parent calling (`tel:` integration)
- Multiple call buttons if a student has multiple numbers
- Clean routing (`/call/:studentId`)
- No phone numbers exposed in URL

### 🎙 Voice Notes (Telugu)
- Record voice notes in **Telugu**
- Works on:
  - Web browsers
  - Android app (via native bridge)
- Safe fallback handling for unsupported environments

### 🧠 AI-Powered Summarization
- Converts Telugu voice notes into **English summaries**
- Editable before saving
- Uses LLM API (Groq)

### 📝 Reports
- Saves call notes with:
  - Student details
  - Selected phone number
  - Telugu voice text
  - English summary
  - Date & time
- Designed as **snapshot records** (not dependent on student list later)

---

## 🛠 Tech Stack

### Frontend
- **React**
- **React Router**
- **Context API**
- **Lucide Icons**
- Modern functional components & hooks

### Voice & AI
- Web Speech API (browser)
- Native speech bridge (Android)
- Groq LLM for summarization

### File Upload
- CSV & XLSX parsing
- Bulk student import

---

## 🧩 Application Architecture

```text
StudentList
 ├── Group students by studentId
 ├── One card per student
 └── Multiple CALL buttons per phone number

StudentCard
 ├── Displays student info
 └── Navigates to CallScreen with selected phone

CallScreen
 ├── Receives studentId (URL)
 ├── Receives phoneNumber (navigation state)
 ├── Voice recording (Telugu)
 ├── AI summarization
 └── Saves report
```
---

## 📂 Project Structure (Simplified)
```text
src/
├── components/
│   ├── StudentList.jsx
│   ├── StudentCard.jsx
│   ├── CallScreen.jsx
│   ├── StudentUpload.jsx
│   └── Layout.jsx
├── context/
│   ├── AppContext.jsx
│   └── SnackbarContext.jsx
├── services/
│   ├── voiceService.js
│   └── groqService.js
├── App.jsx
└── main.jsx
```

---

## ▶️ Getting Started
1️⃣ Install dependencies
`npm install`

2️⃣ Run the app
`npm run dev`

3️⃣ Upload student data
- Go to Upload
- Select CSV / XLSX with columns:
`studentId, studentName, parentName, phoneNumber, className`

---

## 📜 License

This project is for educational and personal use.
You are free to learn from it, extend it, and adapt it with respect.

Made with respect, care, and gratitude 🌷

