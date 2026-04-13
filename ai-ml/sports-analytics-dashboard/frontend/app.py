import streamlit as st
import pandas as pd
import requests
import plotly.express as px

# API URLs
API_URL = "http://backend:8000"
LOCAL_API_URL = "http://localhost:8000"

st.set_page_config(page_title="Sports Analytics Dashboard", layout="wide", page_icon="📈")

st.title("📈 Sports Analytics Real-time Dashboard")
st.markdown("Real-time live scores and machine-learning powered match outcome predictions.")

col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Live Stats")
    live_placeholder = st.empty()

with col2:
    st.subheader("Match Predictions")
    pred_placeholder = st.empty()

st.markdown("---")
st.subheader("Historical Performance")
team = st.selectbox("Select Team for historical analysis:", ["Eagles", "Falcons", "Tigers", "Lions", "Bears", "Wolves"])

try:
    try:
        hist_res = requests.get(f"{API_URL}/historical-performance/{team}", timeout=5)
    except requests.exceptions.ConnectionError:
        hist_res = requests.get(f"{LOCAL_API_URL}/historical-performance/{team}", timeout=5)
    
    if hist_res.status_code == 200:
        df_hist = pd.DataFrame(hist_res.json())
        fig = px.line(df_hist, x="Season", y="Wins", title=f"{team} Wins Over Seasons", markers=True)
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.error("Could not fetch historical data")
except Exception as e:
    st.error(f"Error fetching data: {e}")

# Live Updates Simulation
if st.button("Refresh Live Data"):
    with live_placeholder.container():
        try:
            try:
                live_res = requests.get(f"{API_URL}/live-stats", timeout=3)
            except:
                live_res = requests.get(f"{LOCAL_API_URL}/live-stats", timeout=3)
                
            stats = live_res.json()
            st.metric(label=f"Match: {stats['current_match']}", value=f"{stats['score_a']} - {stats['score_b']}")
            
            st.write("**Possession**")
            st.progress(stats['possession_a'] / 100)
            st.caption(f"Team A ({stats['possession_a']}%) | Team B ({stats['possession_b']}%)")

        except Exception as e:
            st.error("Backend not reachable for live stats.")
            
    with pred_placeholder.container():
        try:
            try:
                pred_res = requests.get(f"{API_URL}/predict", timeout=3)
            except:
                pred_res = requests.get(f"{LOCAL_API_URL}/predict", timeout=3)
                
            predictions = pred_res.json()
            df_preds = pd.DataFrame(predictions)
            
            # Simple bar chart for probabilities
            for i, row in df_preds.iterrows():
                st.write(f"**{row['team_a']} vs {row['team_b']}**")
                prob_data = pd.DataFrame({
                    "Team": [row['team_a'], row['team_b']],
                    "Win Probability": [row['win_probability_a'], row['win_probability_b']]
                })
                fig = px.bar(prob_data, x="Win Probability", y="Team", orientation='h', color="Team", height=200)
                st.plotly_chart(fig, use_container_width=True)

        except Exception as e:
            st.error("Backend not reachable for predictions.")
