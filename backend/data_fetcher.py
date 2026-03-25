import yfinance as yf
import pandas as pd

def fetch_data(ticker: str, period: str = "5y") -> pd.DataFrame:
    try:
        ticker_obj = yf.Ticker(ticker)
        df = ticker_obj.history(period=period)
        if df.empty:
            raise ValueError(f"No data found for ticker {ticker}")
        df = df.dropna(subset=['Close']).copy()
        return df
    except Exception as e:
        raise ValueError(f"Failed to fetch data for {ticker}: {str(e)}")
