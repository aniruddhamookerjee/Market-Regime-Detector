STRATEGY_MAP = {
    "Bull": {
        "name": "Trend Following (Bull)",
        "action": ["Increase exposure to high-beta assets", "Implement trailing stop-losses", "Buy the dip on minor corrections"],
        "riskLevel": "Medium",
        "indicatorsToWatch": ["RSI Divergence", "MACD Crossover", "Volume expansion"]
    },
    "Bear": {
        "name": "Capital Preservation",
        "action": ["Reduce gross exposure", "Hedge with options/inverse ETFs", "Increase cash position"],
        "riskLevel": "Low",
        "indicatorsToWatch": ["VIX spikes", "Credit spreads", "Moving average death crosses"]
    },
    "Sideways": {
        "name": "Mean Reversion",
        "action": ["Sell covered calls", "Trade range-bound oscillations", "Focus on dividend yielders"],
        "riskLevel": "Medium",
        "indicatorsToWatch": ["Bollinger Bands", "Stochastic Oscillator", "Support/Resistance levels"]
    },
    "Volatile": {
        "name": "Volatility Arbitrage",
        "action": ["Reduce position sizes immediately", "Trade options straddles/strangles", "Avoid directional naked bets"],
        "riskLevel": "High",
        "indicatorsToWatch": ["ATR expansion", "News catalysts", "Intraday momentum shifts"]
    }
}

def get_recommendation(regime: str, confidence: float) -> dict:
    rec = STRATEGY_MAP.get(regime, STRATEGY_MAP["Sideways"]).copy()
    
    if confidence < 0.6:
        rec["name"] = f"(Low Conviction) {rec['name']}"
        rec["action"] = ["Wait for clearer signals before committing capital"] + list(rec["action"])
        rec["riskLevel"] = "High"
        
    return rec
