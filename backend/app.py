from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

from data_fetcher import fetch_data
from feature_engineer import engineer_features
from regime_model import RegimeDetector
from interpreter import interpret_regimes, smooth_regimes
from decision_layer import get_recommendation

app = FastAPI(title="RegimeRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    ticker: str
    model_type: str = "gmm"
    period: str = "5y"

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    try:
        # 1. Fetch
        df = fetch_data(req.ticker, req.period)
        
        # 2. Extract Features
        X_scaled, _ = engineer_features(df)
        
        # 3. Fit Model
        detector = RegimeDetector(model_type=req.model_type, n_regimes=4)
        labels, confidences, probas = detector.fit_predict(X_scaled.values)
        
        # 4. Interpret Clusters
        mapping = interpret_regimes(X_scaled, labels)
        
        # Map labels to semantic names
        regime_series = pd.Series(labels).map(mapping)
        
        # Smooth macro noise
        regime_series = smooth_regimes(regime_series)
        
        # Build Output
        current_regime = regime_series.iloc[-1]
        current_confidence = float(confidences[-1])
        
        # Enhancements 1 & 2
        latest_probs = probas[-1]
        sorted_probs = sorted(latest_probs, reverse=True)
        transition_risk = float(round(sorted_probs[1] * 100, 1)) if len(sorted_probs) > 1 else 0.0
        
        current_streak_days = 0
        for r in reversed(regime_series):
            if r == current_regime:
                current_streak_days += 1
            else:
                break
        prev_regime = regime_series.iloc[-(current_streak_days + 1)] if current_streak_days < len(regime_series) else "None"
        
        regime_probs = {}
        for cluster_id, p in enumerate(latest_probs):
            r_name = mapping.get(cluster_id, "Unknown")
            regime_probs[r_name] = float(round(float(p) * 100, 1))
        
        # Recommendation
        recommendation = get_recommendation(current_regime, current_confidence)
        
        # Metrics (Filtered by Current Regime)
        # Compute raw features matching the length of regime_series (after NA drops)
        aligned_df = df.iloc[-len(regime_series):].copy()
        
        aligned_df['Returns'] = df['Close'].pct_change().iloc[-len(regime_series):]
        aligned_df['Volatility'] = aligned_df['Returns'].rolling(window=20).std()
        aligned_df['Momentum'] = df['Close'].pct_change(periods=10).iloc[-len(regime_series):]
        
        ma10 = df['Close'].rolling(window=10).mean().iloc[-len(regime_series):]
        ma50 = df['Close'].rolling(window=50).mean().iloc[-len(regime_series):]
        aligned_df['MA_Diff'] = (ma10 - ma50) / ma50
        
        aligned_df['Regime'] = regime_series.values
        regime_data = aligned_df[aligned_df['Regime'] == current_regime]

        # Calculate means and multiply by 100 for percentages (for returns and vol only, per instructions)
        avg_return = round(float(regime_data['Returns'].mean() * 100), 4) if not regime_data.empty else 0.0
        volatility = round(float(regime_data['Volatility'].mean() * 100), 4) if not regime_data.empty else 0.0
        momentum = round(float(regime_data['Momentum'].mean()), 4) if not regime_data.empty else 0.0
        trend_signal = round(float(regime_data['MA_Diff'].mean()), 4) if not regime_data.empty else 0.0

        metrics = {
            "avg_return": avg_return,
            "volatility": volatility,
            "momentum": momentum,
            "trend_signal": trend_signal
        }
        
        # Chart Data
        # Take last 252 days for chart if available to keep payload size reasonable
        plot_df = df.iloc[-252:].copy()
        plot_regimes = regime_series.iloc[-252:].values
        plot_confs = confidences[-252:]
        
        dates_str = plot_df.index.strftime('%Y-%m-%d').tolist()
        prices = plot_df['Close'].tolist()
        
        chart_data = {
            "dates": dates_str,
            "prices": prices,
            "regimes": plot_regimes.tolist(),
            "confidences": plot_confs.tolist(),
            "returns": aligned_df['Returns'].iloc[-252:].fillna(0).tolist(),
            "volatility": aligned_df['Volatility'].iloc[-252:].fillna(0).tolist(),
            "momentum": aligned_df['Momentum'].iloc[-252:].fillna(0).tolist(),
            "trend_signal": aligned_df['MA_Diff'].iloc[-252:].fillna(0).tolist()
        }
        
        # History Timeline
        history = []
        if len(regime_series) > 0:
            current = regime_series.iloc[0]
            start_date = df.index[0]
            start_idx = 0
            
            for i in range(1, len(regime_series)):
                if regime_series.iloc[i] != current:
                    end_date = df.index[i-1]
                    dur = (end_date - start_date).days
                    history.append({
                        "id": f"regime_{start_idx}",
                        "regime": current,
                        "startDate": start_date.strftime('%Y-%m-%d'),
                        "endDate": end_date.strftime('%Y-%m-%d'),
                        "duration": f"{dur} days",
                        "confidence": float(np.mean(confidences[start_idx:i]))
                    })
                    current = regime_series.iloc[i]
                    start_date = df.index[i]
                    start_idx = i
                    
            # Add final
            end_date = df.index[-1]
            dur = (end_date - start_date).days
            history.append({
                "id": f"regime_{start_idx}",
                "regime": current,
                "startDate": start_date.strftime('%Y-%m-%d'),
                "endDate": end_date.strftime('%Y-%m-%d'),
                "duration": f"{dur} days",
                "confidence": float(np.mean(confidences[start_idx:]))
            })
            
        # Return composite
        return {
            "currentRegime": {
                "label": current_regime,
                "confidence": current_confidence,
                "transition_risk": transition_risk,
                "current_streak_days": current_streak_days,
                "previous_regime": prev_regime,
                "probabilities": regime_probs
            },
            "recommendation": recommendation,
            "metrics": metrics,
            "chartData": chart_data,
            "history": history
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
