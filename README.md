# pickabook-personaliser
An end-to-end prototype for personalising a children’s book illustration with a child’s photo.

The user uploads a photo in the web app.  
The backend prepares the face image and (optionally) sends it to the Instant-ID model on Replicate.  
The generated image (or a fallback image) is then returned to the frontend and displayed.

---

## 1. Live Demo

- **Frontend (Vercel):** https://pickabook-personaliser.vercel.app  
- **Backend (Render):** https://pickabook-backend.onrender.com

> The backend currently returns a stylised or fallback image depending on Replicate credits.

---

## 2. Tech Stack

**Frontend**

- React (Vite)
- Fetch API

**Backend**

- Python, FastAPI, Uvicorn
- Replicate API client
- python-dotenv

**Infra**

- Vercel (frontend hosting)
- Render (FastAPI backend)
- Replicate (Instant-ID model)

---

## 3. Project Structure

```text
pickabook-personaliser/
  --backend/
    main.py
    requirements.txt
    templates/
      template1.png
  --frontend/
    index.html
    package.json
    src/
      App.jsx
      main.jsx

##Limitations
   - Instant-ID requires a billing account on Replicate, so the production demo uses a fallback image instead of a live generation.

