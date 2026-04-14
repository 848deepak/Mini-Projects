# Repository Standards

This repository follows a domain-first monorepo structure to keep projects discoverable and maintainable.

## Standard Tree

```text
mini-projects/
  ai-ml/
    <project-name>/
  cloud-computing/
    <project-name>/
  full-stack/
    <project-name>/
  system-design/
    <project-name>/
  README.md
  REPOSITORY-STANDARDS.md
  .gitignore
```

## Naming Rules

- Use lowercase kebab-case for all project folders.
- Keep one project per folder.
- Put project-specific docs in each project folder (`README.md`, optional `docs/`).
- Keep repository-wide governance docs at root only.

## Recommended Project Layout (Per Project)

```text
<project-name>/
  README.md
  src/
  tests/                      # test or __tests__ depending on stack
  docs/                       # optional architecture/API docs
  .env.example                # tracked sample env file
  .gitignore                  # only when project needs extra rules
```

## Branching Standard

Use `main` as stable integration branch and domain branches for focused work:

- `domains/ai-ml`
- `domains/cloud-computing`
- `domains/full-stack`
- `domains/system-design`

Use per-project long-lived branches when you need isolated project tracks:

- `projects/<domain>/<project>`

Examples:

- `projects/full-stack/online-food-ordering`
- `projects/system-design/digital-wallet`

Use feature branches from domain branches:

- `feature/<domain>/<short-task-name>`
- `fix/<domain>/<short-task-name>`

Examples:

- `feature/full-stack/online-food-ordering-auth`
- `fix/cloud-computing/s3-policy-validation`

## Commit Standard

Use conventional commit style:

- `feat: add payment workflow to smart-banking-system`
- `fix: handle null booking date in travel-booking-itinerary`
- `docs: update deployment guide for portfolio-on-ec2`

## Pull Request Checklist

- Project README updated
- Tests added or updated
- No generated binaries committed
- No secrets or `.env` files committed
- CI checks pass
