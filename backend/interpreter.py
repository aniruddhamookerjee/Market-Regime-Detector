import pandas as pd
import numpy as np

def smooth_regimes(labels: pd.Series, min_days: int = 5) -> pd.Series:
    labels = labels.copy()
    i = 0
    while i < len(labels):
        j = i
        while j < len(labels) and labels.iloc[j] == labels.iloc[i]:
            j += 1
        segment_len = j - i
        if segment_len < min_days and i > 0:
            labels.iloc[i:j] = labels.iloc[i - 1]
        i = j
    return labels

def interpret_regimes(features_df: pd.DataFrame, labels: np.ndarray) -> dict:
    profile = features_df.copy()
    profile['Cluster'] = labels
    
    cluster_stats_df = profile.groupby('Cluster').mean()
    cluster_stats_df = cluster_stats_df.rename(columns={'Returns': 'mean_return', 'Volatility': 'mean_vol'})
    
    regime_map = {}
    if 'mean_vol' not in cluster_stats_df:
        return regime_map
        
    volatility_median = cluster_stats_df['mean_vol'].median()

    for cluster_id, stats in cluster_stats_df.iterrows():
        if (abs(stats['mean_return']) < 0.0008 and stats['mean_vol'] < volatility_median):
            regime_map[cluster_id] = 'Sideways'
        elif stats['mean_return'] < -0.0003:
            regime_map[cluster_id] = 'Bear'
        elif stats['mean_return'] > 0.0003:
            if stats['mean_vol'] > volatility_median * 1.5:
                regime_map[cluster_id] = 'Volatile'
            else:
                regime_map[cluster_id] = 'Bull'
        else:
            regime_map[cluster_id] = 'Volatile'
            
    return regime_map
