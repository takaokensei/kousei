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

  ![Rust](https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white)
  ![Tauri](https://img.shields.io/badge/Tauri-24C8DB?style=flat-square&logo=tauri&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
</div>

<br>

## ⛩️ About The Project

**Kousei** answers a simple question: *Why does compiling a local document require a browser round-trip or a bloated Electron app?*

It is a **Native Desktop Application** designed for engineers and researchers who need the power of **MiKTeX/TeXLive** with the modern DX (Developer Experience) of **VS Code**.

### Key Differentiators
* ⚡ **Rust-Powered Kernel:** Built on **Tauri v2**, providing near-instant startup and minimal memory footprint compared to Electron.
* 🛡️ **Native Performance:** Compiles directly using your machine's CPU and local LaTeX distribution via secure Rust IPC.
* 💎 **Glassmorphism UI:** A distraction-free, aesthetic writing environment using the Tokyo Night palette.
* 🧠 **Intelligent Logs:** Parses cryptic LaTeX errors into actionable, line-by-line diagnostics in the editor.
* 🏗️ **Monaco Engine:** Uses the same text editor core as VS Code for superior syntax highlighting and shortcuts.

## 🏗️ Architecture

Kousei operates as a monolithic desktop executable:

* **Frontend:** React 18 + Vite running in the OS WebView (WebView2 on Windows).
* **Backend (Core):** Rust. Handles the `xelatex` child processes, file system access, and log parsing using highly optimized Regex.
* **Bridge:** Asynchronous message passing (IPC) between React and Rust.

## 🚀 Getting Started

### Prerequisites
* **Rust**: `rustc` and `cargo` (via rustup).
* **Node.js**: v18+.
* **LaTeX**: MiKTeX or TeX Live installed and added to PATH.
* **Tauri Utility**: `npm install -g @tauri-apps/cli` (Optional, but recommended).

### Installation

```bash
# Clone the repository
git clone https://github.com/takaokensei/kousei.git

# Navigate to Client
cd kousei/client

# Install dependencies
npm install
```

### Development

```bash
# Start the Local Development Suite (Rust + Vite)
npm run tauri dev
```

This will compile the Rust core and launch the Native Window.

---

<div align="center">
<samp>Built with 💙 by <a href="https://github.com/takaokensei">@takaokensei</a> at UFRN</samp>
</div>
