# Contributing to EndowStellar 🌌✨

Thank you for your interest in contributing to **EndowStellar**! EndowStellar is an open-source Donor-Advised Fund (DAF) and Philanthropy Protocol built on the Stellar Blockchain and Soroban Smart Contracts.

---

## 🛠 How to Get Started

### 1. Browse Open Issues
Visit our [GitHub Issues Page](https://github.com/olawaleakanbi035-maker/endowStellar/issues) to find tasks available for sprint cycles and Wave Program contributions. Look for labels like:
* `good first issue` — Best for new contributors or frontend tweaks.
* `enhancement` — Feature additions and protocol improvements.
* `help wanted` — High priority tasks requiring community help.
* `documentation` — Guides, setup docs, and API references.

### 2. Request Assignment
Comment on the issue you wish to work on so maintainers can assign it to you:
> *"Hi maintainers! I'd like to work on this issue for the current sprint cycle."*

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js**: `v18.x` or higher
* **Rust & Cargo**: `v1.75+` with `wasm32-unknown-unknown` target (for contract work)
* **Stellar CLI**: Installed for compiling & testing Soroban contracts

### Step-by-Step Setup

1. **Fork & Clone Repository:**
   ```bash
   git clone https://github.com/<your-username>/endowStellar.git
   cd endowStellar
   ```

2. **Install Workspace Dependencies:**
   ```bash
   npm install
   cd apps/web && npm install && cd ../..
   ```

3. **Build & Test Soroban Smart Contracts:**
   ```bash
   npm run contract:build
   npm run contract:test
   ```

4. **Run Web App Locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Development Workflow & Submitting PRs

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/issue-<number>-<short-description>
   ```
   *Example:* `git checkout -b feat/issue-2-wallet-modal`

2. **Make & Test Your Changes:**
   Ensure all smart contract tests and web builds pass cleanly before committing.

3. **Commit & Push:**
   Use clear, conventional commit messages:
   ```bash
   git add .
   git commit -m "feat: implement wallet connection modal (#2)"
   git push origin feat/issue-2-wallet-modal
   ```

4. **Open a Pull Request (PR):**
   * Open a PR targeting `main` on [olawaleakanbi035-maker/endowStellar](https://github.com/olawaleakanbi035-maker/endowStellar).
   * Reference the issue in your PR description: `Closes #<issue_number>`.

---

## 📄 License
By contributing to EndowStellar, you agree that your contributions will be licensed under the MIT License.
