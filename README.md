

# 🧠 AI-Powered NEURANOTE App

A **smart note-taking web app** built with **React**, **FastAPI**, and **LangChain**.
It lets users create, edit, and organize notes with rich text formatting, speech-to-text input, and AI-assisted content generation using **Google Gemini** models.

---

## 🚀 Features

### ✍️ Note Management

* Create, edit, and delete notes.
* Save notes to folders.
* Auto word and character count.
* Responsive, modern UI with TipTap rich-text editor.

### 🎙️ Voice Input

* Dictate notes using the **Web Speech API**.
* Converts spoken words directly into text in real time.

### 🤖 AI Content Generation

* Integrated **LangChain + Google Gemini API** backend.
* Type prompts like *“Write a summary about React”* or *“Generate meeting notes”*.
* Supports **real-time streaming** responses (text appears as the model types).

### ☁️ Image Support

* Upload and embed images via **Cloudinary**.
* Adjustable image size and alignment.

### 💾 Data Persistence

* Notes stored and retrieved securely from a backend API.
* Includes JWT token-based authentication.

---

## 🧩 Tech Stack

### Frontend

* **React.js (Vite)** — fast development environment
* **Framer Motion** — smooth animations
* **TipTap** — advanced rich-text editor
* **TailwindCSS** — modern styling
* **Axios** — API requests
* **React Icons** — clean icons
* **Cloudinary** — for image management

### Backend

* **FastAPI** — lightweight and fast Python backend
* **LangChain** — LLM orchestration
* **Google Gemini** — text generation model
* **Pydantic** — request validation
* **dotenv** — environment management

---

## 🧠 How It Works

1. **User opens the note editor** → Writes or dictates content using the microphone.
2. **Clicks "Generate using AI"** → Opens a modal (`AIGeneratorModal`).
3. **User enters a prompt** → Frontend sends it to the **LangChain FastAPI backend**.
4. **LangChain + Gemini** → Streams the AI-generated text chunks back to the frontend.
5. **Frontend displays text live** → Appears as if the AI is typing in real-time.

---

## ⚙️ Setup Instructions

### 1. Clone this Repository (Frontend)

```bash
git clone (https://github.com/tanux22/NeuraNote.git)
cd NeuraNote
```

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
```

#### Create a `.env` file in the `frontend` directory:

```bash
VITE_LANGCHAIN_FASTAPI_URL=http://127.0.0.1:8000
```

#### Run the frontend:

```bash
npm run dev
```

The app will be available at 👉 **[http://localhost:5173](http://localhost:5173)**

---

### 3. Backend Setup (LangChain + FastAPI)

This project depends on a separate backend service for AI generation.

➡️ **You must also clone and run the backend from this repository:**
👉 [LangChain NeuraNotes Backend Repository](https://github.com/tanux22/Langchain_NeuraNotes)

Once you’ve cloned it, follow its README instructions to start the FastAPI server.

By default, it runs at:

```
http://127.0.0.1:8000
```

Your frontend `.env` must point to this URL:

```bash
VITE_LANGCHAIN_FASTAPI_URL=http://127.0.0.1:8000
```

---



### 4. Running the Full Stack

1. Start the **LangChain FastAPI** backend (from [LangChain_NeuraNotes](https://github.com/tanux22/Langchain_NeuraNotes)):

   ```bash
   fastapi run main.py
   ```

2. Start the **React frontend**:

   ```bash
   npm run dev
   ```

3. Open **[http://localhost:5173](http://localhost:5173)** in your browser.
   The AI features will work once the backend is running.

---

## 💡 Future Enhancements

* 🔐 Authentication for multiple users
* 🧠 Integration with vector databases (Pinecone, FAISS)
* ☁️ Cloud sync for notes
* 🪶 Export to Markdown / PDF
* 🌙 Theme toggle

---

## 🧑‍💻 Author

**Tanush Reddy**
Built using React, FastAPI, and LangChain.
✨ Empowering creativity through intelligent note-taking.

---

✅ **Next:** Here’s the README for your backend (`Langchain_NeuraNotes`) repo:

---

