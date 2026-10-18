# PixelMorph

_By [Shawaiz Shah](https://shawaiz.de) · AI expert & Senior Data Scientist, Berlin · [more side projects](https://shawaiz.de/projects/)_

AI image tools in one app: single- and multi-person **face swap**, **background removal** and **face-shape detection** with styling suggestions.

**Who it's for:** people who want quick, fun photo edits (profile pictures, memes, trying new looks) without installing desktop software.

**Live demo (background removal + face shape):** https://shawaiz.de/demos/pixelmorph/ runs entirely in the browser. Images never leave your device.

## Features

| Feature | Full app (`backend/`) | Web demo (`docs/`) |
|---|---|---|
| Background removal | rembg (U²-Net) | MODNet via transformers.js (WebGPU, WASM fallback) |
| Face-shape detection | MediaPipe Face Mesh + landmark ratios | MediaPipe Face Landmarker + recalibrated ratios, on-device LLM style tips |
| Face swap / multi-face swap | InsightFace (ONNX Runtime) | not included (≈550 MB model, non-commercial weights, consent concerns) |

## Built with

- **Backend:** Python, FastAPI, OpenCV, ONNX Runtime, InsightFace, rembg, MediaPipe
- **Frontend:** Next.js 13, React 18, Tailwind CSS
- **CMS:** Strapi 5 (SQLite) for multilingual page content
- **Web demo:** vanilla JavaScript, transformers.js, MediaPipe Tasks Vision, WebLLM / Chrome built-in AI
- **Infra:** Docker Compose, optional ngrok tunnels

## Project structure

```
backend/   FastAPI service: /background-remover, /faceswap, /multifaceswap, /facedetect, /faceshape-detector
frontend/  Next.js site
cms/       Strapi CMS, content seeded from cms/app/content/*.xlsx
ngrok/     Tunnel config (copy ngrok.example.yml → ngrok.yml, add your own token locally)
docs/      Static on-device web demo (served by GitHub Pages)
```

## How to run

### Web demo

Open https://shawaiz.de/demos/pixelmorph/, or locally:

```bash
cd docs && python3 -m http.server 8080   # open http://localhost:8080
```

### Full app

```bash
cp .env.example .env
docker compose up --build            # backend on https://localhost:443
# frontend (dev):
cd frontend/app && npm install && npm run dev   # http://localhost:3000
# CMS (dev):
cd cms/app && npm install && npm run develop    # http://localhost:1337
```

The face-swap model weights aren't in the repository (`backend/app/core/assets/models/` is gitignored). Download the InsightFace swapper model yourself and note its non-commercial license terms.

## Privacy

- The web demo processes images only in your browser.
- The repository contains no user uploads. Upload folders, the CMS database and ngrok configs are gitignored, and secrets go in a local `.env` (see `.env.example`).

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Author

Built and maintained by **[Shawaiz Shah](https://shawaiz.de)**: portfolio, contact and more projects at [shawaiz.de](https://shawaiz.de) · [GitHub](https://github.com/shahshawaiz) · [LinkedIn](https://www.linkedin.com/in/shawaiz-shah-32b40537).

## License

Code: [MIT](LICENSE) © Shawaiz Shah. Third-party models keep their own licenses (MODNet: Apache-2.0; MediaPipe: Apache-2.0; InsightFace models: non-commercial research only).
