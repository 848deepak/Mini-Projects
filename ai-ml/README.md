# AI / ML Projects

Applied machine learning and data analytics projects covering recommendation engines, sports intelligence dashboards, and data-driven product features.

## Overview

| Metric | Value |
|---|---|
| Total Projects | 2 |
| Difficulty Range | Intermediate |
| Estimated Effort | 8–14 hours per project |
| Primary Stack | Python, FastAPI, scikit-learn, pandas, React / Next.js |

## Domain Focus

These projects demonstrate core applied ML skills:

- **Recommendation Systems** — collaborative filtering, content-based filtering, matrix factorization
- **Sports Analytics** — data ingestion pipelines, statistical modeling, real-time dashboards
- **API Serving** — wrapping ML models behind REST and WebSocket endpoints
- **Visualization** — chart-driven frontends backed by live model predictions

## Project Index

| Project | Difficulty | Est. Effort | Key Concepts |
|---|---|---|---|
| [recommendation-system](recommendation-system) | Intermediate | 8–14 hours | Collaborative filtering, user/item embeddings, REST API |
| [sports-analytics-dashboard](sports-analytics-dashboard) | Intermediate | 8–14 hours | Data pipelines, statistical analysis, interactive dashboard |

> **Note:** A full-stack variant of `sports-analytics-dashboard` also exists at [`full-stack/sports-analytics-dashboard`](../full-stack/sports-analytics-dashboard) with a different implementation focus (product delivery vs. analytics depth).

## Quick Start

1. `cd` into the project folder you want to run.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv && source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Follow the project-level `README.md` for startup commands and environment variables.

## Prerequisites

- Python 3.10+
- pip / pip-tools
- Node.js 18+ (for projects with a frontend)
- Basic familiarity with scikit-learn and pandas

## Stack Reference

| Layer | Technology |
|---|---|
| ML / Data | scikit-learn, pandas, NumPy |
| API | FastAPI or Flask |
| Frontend | React / Next.js (where applicable) |
| Storage | CSV, SQLite, or PostgreSQL |

## Learning Path

Follow these projects in order if you are new to applied ML:

1. [recommendation-system](recommendation-system) — understand core ML modeling and API serving
2. [sports-analytics-dashboard](sports-analytics-dashboard) — apply data pipelines and visualization at scale

## Related Domains

- For the full-stack product angle on analytics, see [`full-stack/sports-analytics-dashboard`](../full-stack/sports-analytics-dashboard).
- For cloud deployment of ML APIs, see the [`cloud-computing/`](../cloud-computing) domain (Lambda, API Gateway patterns).

---

Back to [Repository Root](../README.md)
