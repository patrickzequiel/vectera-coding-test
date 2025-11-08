# Repository Guidelines

## Project Structure & Module Organization
- Backend (Django REST): `backend/` with project config in `backend/project/` and app code in `backend/meetings/` (`models.py`, `serializers.py`, `views.py`, `urls.py`, `services/ai.py`). Tests live in `backend/meetings/tests/`.
- Frontend (Angular): `frontend/` with source in `frontend/src/app/` (e.g., `meetings/` feature, shared utilities in `shared/`). Unit tests in `__tests__/` and `*.spec.ts` files.
- Dev Ops: `docker-compose.yml`, backend `Dockerfile`, CI at `.github/workflows/ci.yml`.

## Build, Test, and Development Commands
- Backend (local): `cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver`
- Backend (Docker): `docker-compose up --build` (starts Postgres and Django via `run-server.sh`).
- Backend tests: `cd backend && pytest` (coverage: `pytest --cov=meetings`).
- Frontend dev: `cd frontend && npm install && npm start` (proxies `/api` to `http://localhost:8000`).
- Frontend build: `cd frontend && npm run build`
- Frontend tests: `cd frontend && npm test`
- Lint (frontend): `cd frontend && npm run lint`

## Coding Style & Naming Conventions
- Python: PEP 8, 4‑space indentation, snake_case for functions/vars, PascalCase for classes. Django app modules follow file-per-concern (`models.py`, `views.py`, etc.).
- TypeScript/Angular: 2‑space indentation. Components/Services use PascalCase classes and kebab‑case filenames (e.g., `meetings-list.component.ts`, `meetings.service.ts`). Prefer Angular style guide for folder structure.
- Formatting: Prettier is configured in `frontend/` (`.prettierrc.json`). Run `npm run format` (write) or `npm run format:check` (verify). Basic rules: 100‑col width, single quotes, trailing commas, semicolons.
- Linting: ESLint configured for Angular (`npm run lint`). Keep imports ordered and avoid unused symbols.
  - Use `npm run lint:fix` to apply safe autofixes. ESLint extends `eslint-config-prettier` to avoid conflicts with Prettier formatting.

## Testing Guidelines
- Backend: `pytest` with `pytest-django` (config in `backend/pytest.ini`, test files match `test_*.py`). Aim for meaningful unit tests around `meetings` models, serializers, and API views.
- Frontend: Jasmine/Karma (`*.spec.ts`). Keep tests close to components/services. Coverage HTML reports under `frontend/coverage/`.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise subject (≤ 50 chars), present tense (e.g., "Add meetings list filtering"). Include a body explaining the why when helpful. Reference issues (`#123`).
- PRs: Clear description, linked issues, setup/repro steps, and expected/actual behavior. Include screenshots/GIFs for UI changes and note test/coverage impact. Ensure `pytest`, `npm test`, and `npm run lint` pass locally.

## Security & Configuration Tips
- Backend env: copy `backend/.env.example` to `.env` for local overrides; never commit secrets. Database and CORS are configured via env vars; default Docker values are safe for local dev.

## Rule
- Never Agree Without Evidence
- Follow a senior developer idea to suggest things, and keep it simple and clear
- If it becomes to complex, suggest to break into clear ideas, easy to humans read
- Always break into small components, but not too abstract, the goal is always easy to read
- Follow isolated css, but since it's a big project, we should have a glocal css that contains the main rules, and always focus on reusable components
- Reusable components, always
- Easy implementation
- Easy for newcomers to read the file and the structure and the code, so KEEP IT SIMPLE
- Keep messages short, simple, like I'm a kid learning Angular and Python but don't over write things, just go straight to the point, you can use emojis and silly examples
- For the Front end, you're a front end senior
- Don't add comments. If you see AI generated comments, remove it
- Keep the default of px for everything.