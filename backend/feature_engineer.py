import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def engineer_features(df: pd.DataFrame) -> tuple[pd.DataFrame, StandardScaler]:
    df = df.copy()
    
    df['Returns'] = df['Close'].pct_change()
    df['Volatility'] = df['Returns'].rolling(window=20).std()
    df['Momentum'] = df['Close'].pct_change(periods=10)
    
    ma10 = df['Close'].rolling(window=10).mean()
    ma50 = df['Close'].rolling(window=50).mean()
    df['MA_Diff'] = (ma10 - ma50) / ma50
    
    df = df.dropna().copy()
    
    features = ['Returns', 'Volatility', 'Momentum', 'MA_Diff']
    X = df[features]
    
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=features, index=X.index)
    
    return X_scaled, scaler
