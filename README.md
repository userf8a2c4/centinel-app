<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dPbwnqbfHwlFxcw7xd6PQ98XfhNdDi1_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Opcional) Configura `VITE_ENGINE_BASE_URL` en `.env.local` para apuntar al backend
   (ej. `http://localhost:3000`), así el frontend consume `data/summary.json` del engine.
   Si sirves frontend y backend en el mismo dominio, el frontend también intentará
   `/data/summary.json` en el origen actual automáticamente.
4. Run the app:
   `npm run dev`
