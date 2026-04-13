# Sports Analytics Dashboard

Category: AI/Machine Learning

## Overview
A real-time sports analytics and prediction dashboard. This scalable application simulates live data feeds for sports matches and utilizes predictive mathematical modeling to calculate win probabilities on the fly. It is built entirely in Python, making it an excellent example of bridging data engineering with frontend visualization.

## Features
- **Live Data Feed Simulation**: Backend endpoints mimicking real-time data ingestion for scores and possession statistics.
- **Predictive Engine**: Probabilistic win-condition metrics served rapidly via REST API.
- **Real-Time Visualizations**: Implements Plotly and Altair within Streamlit to render live graphs and performance charts.
- **Historical Analysis**: Fetches and visualizes season-over-season performance.
- **Dockerized**: Multi-container orchestration guaranteeing identical environments across development and production.

## Tech Stack
- **Backend & ML**: Python, FastAPI, Uvicorn, Pandas, Pydantic.
- **Frontend**: Streamlit, Plotly Express, Requests.
- **DevOps**: Docker, Docker Compose.

## Getting Started

### Prerequisites
- Docker & Docker Compose installed on your system.

### Running with Docker (Recommended)
1. Navigate to the project root:
   ```bash
   cd sports-analytics-dashboard
   ```
2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```
3. Visit `http://localhost:8501` to view the live Sports Dashboard.
4. Visit `http://localhost:8000/docs` to view the FastAPI interactive documentation.

### Folder Structure
- `backend/`: FastAPI core holding domain logic and prediction structures.
- `frontend/`: Streamlit visualization layer featuring Plotly charts.
- `docker-compose.yml`: Service composition file.
- `README.md`: Project documentation.
