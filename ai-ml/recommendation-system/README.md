# Recommendation System

Category: AI/Machine Learning

## Overview
A production-ready artificial intelligence movie recommendation engine. This application leverages collaborative filtering to suggest movies based on user preferences. It is built entirely in Python using a service-oriented architecture, showcasing how machine learning models can be served via REST APIs and consumed by dynamic frontends.

## Features
- **Item-based Collaborative Filtering**: Uses `scikit-learn`'s cosine similarity to find relationships between users and items.
- **RESTful API**: Fast and robust backend served via FastAPI capable of handling model predictions efficiently.
- **Interactive UI**: A beautiful, pure-Python dashboard built with Streamlit allowing users to select movies and receive real-time recommendations.
- **Dockerized**: Fully containerized backend and frontend with Docker Compose for immediate deployment.

## Tech Stack
- **Backend & ML**: Python, FastAPI, Uvicorn, Scikit-Learn, Pandas, Numpy.
- **Frontend**: Streamlit, Requests.
- **DevOps**: Docker, Docker Compose.

## Getting Started

### Prerequisites
- Docker & Docker Compose installed on your system.

### Running with Docker (Recommended)
1. Navigate to the project root:
   ```bash
   cd recommendation-system
   ```
2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```
3. Visit `http://localhost:8501` to view the Streamlit Application.
4. Visit `http://localhost:8000/docs` to view the interactive API documentation (Swagger UI).

### Folder Structure
- `backend/`: FastAPI application and ML model training script (`model.py`).
- `frontend/`: Streamlit web application.
- `docker-compose.yml`: Multi-container orchestration.
- `README.md`: Project documentation.
