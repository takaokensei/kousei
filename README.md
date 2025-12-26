<div align="center">
  <h1>Kousei (構成)</h1>
  <p>
    <strong>The Art of Structured Composition.</strong><br>
    A high-performance, local-first LaTeX IDE for precision engineering.
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>

  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
</div>

<br>

## ⛩️ About The Project

**Kousei** answers a simple question: *Why does compiling a local document require a browser round-trip to a cloud server?*

Designed for engineers and researchers who need the power of **MiKTeX/TeXLive** with the modern DX (Developer Experience) of **VS Code**, but without the bloat.

### Key Differentiators
* ⚡ **Local-First Kernel:** Compiles directly using your machine's CPU and LaTeX distribution. No queues, no timeouts.
* 💎 **Glassmorphism UI:** A distraction-free, aesthetic writing environment using the Tokyo Night palette.
* 🧠 **Intelligent Logs:** Parses cryptic LaTeX errors into actionable, line-by-line diagnostics in the editor.
* 🏗️ **Monaco Engine:** Uses the same text editor core as VS Code for superior syntax highlighting and shortcuts.

## 🏗️ Architecture

Kousei operates on a client-server architecture running locally:

* **Client (`/client`):** React 18 + Vite. Manages the editor state, file tree, and PDF visualization (PDF.js).
* **Server (`/server`):** Node.js Express. Acts as a bridge to the OS `child_process`, spawning `xelatex` jobs and streaming logs via WebSockets/REST.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MiKTeX or TeX Live installed and added to PATH.

### Installation

```bash
# Clone the repository
git clone https://github.com/takaokensei/kousei.git

# Install dependencies (Root)
npm install

# Start the Development Suite (Client + Server)
npm run dev
```

---

<div align="center">
<samp>Built with 💙 by <a href="https://github.com/takaokensei">@takaokensei</a> at UFRN</samp>
</div>
