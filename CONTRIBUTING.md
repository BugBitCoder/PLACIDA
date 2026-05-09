# 🤝 Contributing to Placida

Thank you for your interest in contributing to Placida! To maintain a smooth workflow, please follow these guidelines.

## 1. Local Setup
Placida is a frontend-only project. To get started:
- Clone the repository.
- Open `index.html` directly in your preferred web browser.
- **Recommended**: Use the **Live Server** extension in VS Code for a better development experience.

## 2. Branch Naming
Please use the following naming convention for branches:
- **Sahil**: `frontend-sahil`
- **Ayushi**: `backend-ayushi`
- **Sanchari**: `features-sanchari`
- **Divyans**: `docs-divyans`

## 3. Commit Format
Follow this format for all commit messages:
- `feat(name): description` (e.g., `feat(sahil): add mood chart`)
- `fix(name): description` (e.g., `fix(ayushi): fix chat scroll`)
- `docs(name): description` (e.g., `docs(divyans): update changelog`)

## 4. PR Process
1. Work on your assigned branch.
2. Push changes and create a Pull Request (PR) to the `main` branch.
3. **Divyans** will review the PR.
4. Once approved, the PR will be merged.

## 5. File Ownership
| Member | Role | Files Owned |
|---|---|---|
| **Sahil** | Frontend Dev | `index.html`, `dashboard.html`, `script.js`, `style.css` |
| **Ayushi** | UI Dev | `chatbot.html`, `features.js` (Chat Logic) |
| **Sanchari** | Frontend Dev | `breathe.html`, `summary.html`, `features.js` (Breathe/Summary Logic) |
| **Divyans** | QA & Docs | `README.md`, `TESTING.md`, `CHANGELOG.md`, `CONTRIBUTING.md` |

## 6. Design System
- **Style**: Dark glassmorphism.
- **Typography**: Primary font is **Inter**.
- **Theming**: Use the predefined CSS variables in `style.css` for consistency.

## 7. Code Style
- **Pure Javascript**: Use Vanilla JS only.
- **Libraries**: No external libraries except **Chart.js** (via CDN).
- **Persistence**: Use `localStorage` for all data storage requirements.
