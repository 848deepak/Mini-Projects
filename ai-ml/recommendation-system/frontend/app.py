import streamlit as st
import requests
import pandas as pd

# API URL (Uses docker internal network when running in compose, else fallback to localhost)
API_URL = "http://backend:8000"
LOCAL_API_URL = "http://localhost:8000"

st.set_page_config(page_title="AI Movie Recommender", layout="centered", page_icon="🎥")

st.title("🎥 AI Movie Recommender")
st.write("Welcome to the modern movie recommendation system powered by Collaborative Filtering!")

# Simple dictionary for movie titles
movies = {
    101: "The Matrix",
    102: "Inception",
    103: "Interstellar",
    104: "The Dark Knight"
}

st.sidebar.header("Select a Movie")
selected_movie_name = st.sidebar.selectbox("Choose a movie you like:", list(movies.values()))
selected_movie_id = list(movies.keys())[list(movies.values()).index(selected_movie_name)]

st.subheader(f"Because you liked **{selected_movie_name}**, we recommend:")

if st.button("Get Recommendations"):
    with st.spinner("Fetching AI recommendations..."):
        try:
            try:
                response = requests.get(f"{API_URL}/recommend/{selected_movie_id}", timeout=5)
            except requests.exceptions.ConnectionError:
                response = requests.get(f"{LOCAL_API_URL}/recommend/{selected_movie_id}", timeout=5)

            if response.status_code == 200:
                data = response.json()
                recs = data.get("recommendations", {})
                
                if not recs:
                    st.info("No recommendations found.")
                else:
                    for rec_id, score in recs.items():
                        rec_id = int(rec_id)
                        movie_title = movies.get(rec_id, f"Unknown Movie {rec_id}")
                        st.success(f"**{movie_title}** (Similarity Score: {score:.2f})")
            else:
                st.error(f"Error fetching recommendations: {response.json().get('detail', 'Unknown error')}")
        except Exception as e:
            st.error(f"Could not connect to the backend API. Is it running? Error: {e}")

st.markdown("---")
st.markdown("### How it works")
st.markdown("This uses an Item-based Collaborative Filtering approach built with Scikit-learn and served via FastAPI.")
