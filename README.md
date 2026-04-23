<div align="center">
  <h1>🕵️‍♂️ VulnHunt</h1>
  <p><strong>A Gamified, Terminal-Themed Code Security Challenge</strong></p>
  <p>Level up your cybersecurity IQ by identifying vulnerabilities in multi-vector code snippets.</p>
</div>

<br />

## 🎯 About the Project

**VulnHunt** is an interactive, browser-based cybersecurity training game. Disguised as a retro Linux terminal, it challenges players to spot critical security flaws—like SQL Injections, Cross-Site Scripting (XSS), and Broken Authentication—hidden within real-world code snippets across various languages (JavaScript, Python, Java, PHP, etc.).

For every vulnerability verified, players earn XP, build streaks, and receive detailed explanations and secure patch solutions for the analyzed threats. 

## ✨ Features

- **Terminal Aesthetic**: Clean, dark-mode UI with mono-spaced typography, subtle glowing effects, and command-line interactions.
- **Multi-Vector Analysis**: Challenges cover the OWASP Top 10 (Injection, Sensitive Data Exposure, Misconfigurations, etc.).
- **Dynamic Gameplay**: Questions are randomized, and options are shuffled on every playthrough to ensure replayability.
- **Hint System**: Stuck on a module? Decrypt a hint at the cost of valuable timer seconds.
- **Post-Game Reports**: Get a detailed mastery breakdown of your performance by category, complete with actionable advice for improvement.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Native inline styles (Zero external CSS dependencies!)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/vulnhunt.git
   ```
2. Navigate into the project directory:
   ```sh
   cd vulnhunt
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

## 📁 Project Structure

* `src/screens/` - Contains the main views: `IntroScreen`, `QuestionScreen`, and `ProfileScreen`.
* `src/components/` - Reusable UI elements like the Rank Avatar.
* `src/data/questions.ts` - The core database of vulnerabilities and code challenges.
* `src/App.tsx` - The main controller handling game state, routing, and scoring logic.

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

If you have a great idea for a new code vulnerability question:
1. Fork the Project.
2. Add your scenario to `src/data/questions.ts`.
3. Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>> AWAITING_OPERATOR_CONFIG...</i>
</div>